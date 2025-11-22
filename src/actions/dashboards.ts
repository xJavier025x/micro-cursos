'use server';

import prisma from '@/lib/prisma';
import { getUserProgressSummary } from './progress';

// --- 8.1 Dashboard de empleado (EMPLOYEE) ---

export async function getUserDashboardData(userId: string) {
  try {
    // 1. Cursos inscritos (todos los cursos)
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lessons: {
          select: { id: true }
        }
      }
    });

    // 2. Progreso por curso
    const coursesWithProgress = await Promise.all(courses.map(async (course) => {
      const totalLessons = course.lessons.length;
      
      const completedLessonsCount = await prisma.userProgress.count({
        where: {
          userId,
          lesson: {
            courseId: course.id
          }
        }
      });

      const progress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

      return {
        ...course,
        progress,
        totalLessons,
        completedLessons: completedLessonsCount
      };
    }));

    // 3. Último quiz realizado
    const lastQuizResult = await prisma.quizResult.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        quiz: {
          include: {
            lesson: {
              select: { title: true }
            }
          }
        }
      }
    });

    // Resumen general
    const summary = await getUserProgressSummary(userId);

    return {
      courses: coursesWithProgress,
      lastQuizResult,
      summary
    };
  } catch (error) {
    return { error: 'Error al obtener datos del dashboard' };
  }
}

export async function getUserCourseDetail(userId: string, courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            quiz: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!course) return null;

    // Get completed lessons IDs
    const completedLessons = await prisma.userProgress.findMany({
      where: {
        userId,
        lesson: {
          courseId
        }
      },
      select: { lessonId: true }
    });

    const completedLessonIds = new Set(completedLessons.map(p => p.lessonId));

    const lessonsWithStatus = course.lessons.map(lesson => ({
      ...lesson,
      isCompleted: completedLessonIds.has(lesson.id),
      hasQuiz: !!lesson.quiz
    }));

    return {
      ...course,
      lessons: lessonsWithStatus
    };
  } catch (error) {
    return null;
  }
}

// --- 8.2 Dashboard de admin (ADMIN) ---

export async function getAdminDashboardMetrics() {
  try {
    const [
      usersCount,
      coursesCount,
      lessonsCount,
      quizResultsCount,
      avgScore
    ] = await prisma.$transaction([
      prisma.user.count(),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.quizResult.count(),
      prisma.quizResult.aggregate({
        _avg: {
          score: true
        }
      })
    ]);

    // Users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });

    return {
      usersCount,
      coursesCount,
      lessonsCount,
      quizResultsCount,
      averageScore: Math.round(avgScore._avg.score || 0),
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count.role;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    return { error: 'Error al obtener métricas de admin' };
  }
}

export async function getCourseAnalytics(courseId: string) {
  try {
    // 1. Usuarios que han completado el curso (todos los lessons completados)
    // This is complex to query efficiently without a 'CourseCompletion' table.
    // Approximation: Users who have completed N lessons where N is total lessons in course.
    
    const totalLessons = await prisma.lesson.count({ where: { courseId } });
    
    let completedCourseCount = 0;
    
    if (totalLessons > 0) {
      // Get users with count of completed lessons for this course
      const userProgressCounts = await prisma.userProgress.groupBy({
        by: ['userId'],
        where: {
          lesson: { courseId }
        },
        _count: {
          lessonId: true
        }
      });
      
      completedCourseCount = userProgressCounts.filter(u => u._count.lessonId >= totalLessons).length;
    }

    // 2. Promedio de score en quizzes del curso
    const avgScore = await prisma.quizResult.aggregate({
      where: {
        quiz: {
          lesson: { courseId }
        }
      },
      _avg: {
        score: true
      }
    });

    // 3. Distribución de progreso (0%, 1-50%, 51-99%, 100%)
    // We need to fetch all users progress for this course.
    // For scalability this should be done differently, but for now:
    const allUsers = await prisma.user.findMany({ where: { role: 'EMPLOYEE' }, select: { id: true } });
    
    const progressDistribution = {
      zero: 0,
      inProgress: 0, // 1-99%
      completed: 0 // 100%
    };

    // This loop might be heavy if many users. 
    // Better: use the userProgressCounts from above.
    // But we need to account for users with 0 progress (not in userProgressCounts).
    
    // Let's use the userProgressCounts we already fetched (but we need to fetch it again without filtering for completed only if we want distribution)
    const userProgressCounts = await prisma.userProgress.groupBy({
      by: ['userId'],
      where: {
        lesson: { courseId }
      },
      _count: {
        lessonId: true
      }
    });

    const userProgressMap = new Map(userProgressCounts.map(u => [u.userId, u._count.lessonId]));

    for (const user of allUsers) {
      const completed = userProgressMap.get(user.id) || 0;
      if (completed === 0) {
        progressDistribution.zero++;
      } else if (completed >= totalLessons) {
        progressDistribution.completed++;
      } else {
        progressDistribution.inProgress++;
      }
    }

    return {
      totalLessons,
      completedCourseCount,
      averageScore: Math.round(avgScore._avg.score || 0),
      progressDistribution
    };
  } catch (error) {
    return { error: 'Error al obtener analíticas del curso' };
  }
}
