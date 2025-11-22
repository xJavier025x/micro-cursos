'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- Schemas ---
const courseSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
});

// --- 2.1 Read Actions ---

export async function listCourses(params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.search) {
    where.title = { contains: params.search, mode: 'insensitive' };
  }

  try {
    const [courses, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { lessons: true } }
        }
      }),
      prisma.course.count({ where }),
    ]);

    return { courses, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    return { error: 'Error al listar cursos' };
  }
}

export async function getCourseById(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return course;
  } catch (error) {
    return null;
  }
}

export async function getCoursesWithProgress(userId: string, params: { page?: number; limit?: number; search?: string } = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.search) {
    where.title = { contains: params.search, mode: 'insensitive' };
  }

  try {
    const [courses, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lessons: {
            select: {
              id: true,
              userProgress: {
                where: { userId },
                select: { id: true },
              },
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    const coursesWithProgress = courses.map(course => {
      const totalLessons = course.lessons.length;
      const completedLessons = course.lessons.reduce((acc, lesson) => {
        return acc + (lesson.userProgress.length > 0 ? 1 : 0);
      }, 0);
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Remove heavy lessons data from result if not needed, or keep it
      const { lessons, ...courseData } = course;
      return {
        ...courseData,
        totalLessons,
        completedLessons,
        progress,
      };
    });

    return { courses: coursesWithProgress, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    return { error: 'Error al obtener progreso de cursos' };
  }
}

// --- 2.2 Write Actions (ADMIN) ---

export async function createCourse(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = courseSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.course.create({
      data: {
        title: result.data.title,
        description: result.data.description,
      },
    });
  } catch (error) {
    return { error: 'Error al crear el curso' };
  }

  revalidatePath('/admin/courses');
  revalidatePath('/courses');
  redirect('/admin/courses');
}

export async function updateCourse(courseId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = courseSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: result.data.title,
        description: result.data.description,
      },
    });
  } catch (error) {
    return { error: 'Error al actualizar el curso' };
  }

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath('/courses');
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    });
    revalidatePath('/admin/courses');
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar el curso' };
  }
}
