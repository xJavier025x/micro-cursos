'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (existingUser) {
      return { error: 'El usuario ya existe' };
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    await prisma.user.create({
      data: {
        email: result.data.email,
        password: hashedPassword,
        name: result.data.name,
        role: 'EMPLOYEE',
      },
    });

    return { success: true };
  } catch (error) {
    return { error: 'Error al registrar usuario' };
  }
}

export async function loginUser(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Credenciales inválidas' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      return { error: 'Usuario no encontrado' };
    }

    const isValid = await bcrypt.compare(result.data.password, user.password);

    if (!isValid) {
      return { error: 'Contraseña incorrecta' };
    }

    // TODO: Integrate with NextAuth v5 when available/configured
    // For now, setting a simple cookie for demonstration
    (await cookies()).set('session', user.id); // In production use secure session management

    return { success: true, role: user.role };
  } catch (error) {
    return { error: 'Error al iniciar sesión' };
  }
}

export async function logoutUser() {
  (await cookies()).delete('session');
  redirect('/auth/login');
}
