'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// --- Schemas ---
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

import { auth } from '@/auth';

// --- 1.2 Profile Management ---

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = updateUserSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: result.data.name,
        email: result.data.email,
      },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar perfil' };
  }
}

export async function changeUserPassword(userId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = changePasswordSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Datos inválidos' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: 'Usuario no encontrado' };

    const isValid = await bcrypt.compare(result.data.currentPassword, user.password);
    if (!isValid) return { error: 'Contraseña actual incorrecta' };

    const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    return { error: 'Error al cambiar contraseña' };
  }
}

// --- 1.3 Admin User Management ---

export async function listUsers(params: { page?: number; limit?: number; search?: string; role?: 'ADMIN' | 'EMPLOYEE' } = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  if (params.role) {
    where.role = params.role;
  }

  try {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    return { error: 'Error al listar usuarios' };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'EMPLOYEE') {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar rol' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar usuario' };
  }
}
