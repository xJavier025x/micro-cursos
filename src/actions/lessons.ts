'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- Schemas ---
const lessonSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().optional(),
  videoUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  order: z.number().int().optional(),
});

// --- 3.1 Read Actions ---

export async function getLessonById(lessonId: string) {
  try {
    const session = (await cookies()).get('session')?.value;
    const userId = session; // Assuming session is userId for now

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: { id: true, title: true },
        },
        quiz: {
          select: { id: true },
        },
        userProgress: userId ? {
          where: { userId },
          select: { completedAt: true },
        } : false,
      },
    });
    return lesson;
  } catch (error) {
    return null;
  }
}

export async function listLessonByCourse(courseId: string) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
    return lessons;
  } catch (error) {
    return [];
  }
}

// --- 3.2 Write Actions (ADMIN) ---

export async function createLesson(courseId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = lessonSchema.safeParse({
    ...data,
    order: data.order ? parseInt(data.order as string) : undefined,
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    // Get last order if not provided
    let order = result.data.order;
    if (order === undefined) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });
      order = (lastLesson?.order || 0) + 1;
    }

    await prisma.lesson.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        videoUrl: result.data.videoUrl || null,
        order: order,
        courseId: courseId,
      },
    });
  } catch (error) {
    return { error: 'Error al crear la lección' };
  }

  revalidatePath(`/admin/courses/${courseId}/lessons`);
  redirect(`/admin/courses/${courseId}/lessons`);
}

export async function updateLesson(lessonId: string, courseId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = lessonSchema.safeParse({
    ...data,
    order: data.order ? parseInt(data.order as string) : undefined,
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: result.data.title,
        content: result.data.content,
        videoUrl: result.data.videoUrl || null,
        order: result.data.order,
      },
    });
  } catch (error) {
    return { error: 'Error al actualizar la lección' };
  }

  revalidatePath(`/admin/courses/${courseId}/lessons`);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  return { success: true };
}

export async function deleteLesson(lessonId: string, courseId: string) {
  try {
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    revalidatePath(`/admin/courses/${courseId}/lessons`);
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar la lección' };
  }
}

export async function reorderLessons(courseId: string, newOrder: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      newOrder.map((item) =>
        prisma.lesson.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath(`/admin/courses/${courseId}/lessons`);
    return { success: true };
  } catch (error) {
    return { error: 'Error al reordenar lecciones' };
  }
}
