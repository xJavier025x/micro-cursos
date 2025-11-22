'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- 6.1 Lectura ---

export async function getUserProgressByCourse(userId: string, courseId: string) {
  try {
    const progress = await prisma.userProgress.findMany({
      where: {
        userId,
        lesson: {
          courseId,
        },
      },
      include: {
        lesson: true,
      },
    });
    return progress;
  } catch (error) {
    return [];
  }
}

export async function getLessonProgress(userId: string, lessonId: string) {
  try {
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });
    return progress;
  } catch (error) {
    return null;
  }
}

export async function getUserProgressSummary(userId: string) {
  try {
    const completedLessonsCount = await prisma.userProgress.count({
      where: { userId },
    });

    // To get active courses, we find courses where the user has at least one completed lesson
    const activeCourses = await prisma.userProgress.groupBy({
      by: ['lessonId'],
      where: { userId },
      // This is a bit tricky with just groupBy on lessonId. 
      // We need to join with Lesson -> Course.
      // Prisma groupBy doesn't support deep relations easily for counting distinct courses directly in one go efficiently without raw query or fetching.
      // Alternative: Fetch all progress with lesson.courseId and distinct.
    });
    
    // Let's do a more direct approach:
    const progressWithCourse = await prisma.userProgress.findMany({
      where: { userId },
      select: {
        lesson: {
          select: { courseId: true }
        }
      },
      distinct: ['lessonId'] // actually we want distinct courseId, but distinct is on the model fields.
    });

    const courseIds = new Set(progressWithCourse.map(p => p.lesson.courseId));

    return {
      completedLessons: completedLessonsCount,
      activeCourses: courseIds.size,
    };
  } catch (error) {
    return { completedLessons: 0, activeCourses: 0 };
  }
}

// --- 6.2 Escritura ---

export async function markLessonAsCompleted(userId: string, lessonId: string) {
  try {
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completedAt: new Date(),
      },
    });
    
    // Revalidate relevant paths
    // We don't know the courseId here easily without fetching.
    // But we can revalidate the lesson page and course page if we knew the IDs.
    // For now, let's revalidate the dashboard and courses list generally.
    revalidatePath('/dashboard');
    revalidatePath('/courses');
    
    return { success: true };
  } catch (error) {
    return { error: 'Error al marcar lección como completada' };
  }
}
