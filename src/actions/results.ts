'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { markLessonAsCompleted } from './progress';

// --- 7.1 Lectura ---

export async function getQuizResultsByUser(userId: string, params: { page?: number; limit?: number } = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  try {
    const [results, total] = await prisma.$transaction([
      prisma.quizResult.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          quiz: {
            include: {
              lesson: {
                select: { title: true, course: { select: { title: true } } }
              }
            }
          }
        }
      }),
      prisma.quizResult.count({ where: { userId } })
    ]);

    return { results, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    return { error: 'Error al obtener historial de resultados' };
  }
}

export async function getQuizResultsByQuiz(quizId: string, params: { page?: number; limit?: number } = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  try {
    const [results, total] = await prisma.$transaction([
      prisma.quizResult.findMany({
        where: { quizId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.quizResult.count({ where: { quizId } })
    ]);

    return { results, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    return { error: 'Error al obtener resultados del quiz' };
  }
}

export async function getLatestQuizResult(userId: string, quizId: string) {
  try {
    const result = await prisma.quizResult.findFirst({
      where: { userId, quizId },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: true
      }
    });
    return result;
  } catch (error) {
    return null;
  }
}

// --- 7.2 Escritura ---

export async function submitQuizAttempt(userId: string, quizId: string, answers: Record<string, string>) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
        lesson: true, // Need lesson info to mark as completed
      },
    });

    if (!quiz) {
      return { error: 'Quiz no encontrado' };
    }

    let correctCount = 0;
    let totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find(opt => opt.isCorrect);

      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / totalQuestions) * 100);

    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        quizId,
        score,
        answers: {
          create: quiz.questions.map(q => ({
            questionId: q.id,
            optionId: answers[q.id],
          })).filter(a => a.optionId)
        }
      }
    });

    // Opcional: si la nota es suficiente (ej. >= 70), marca la lección como completada
    if (score >= 70) {
      await markLessonAsCompleted(userId, quiz.lessonId);
    }

    revalidatePath('/results');
    revalidatePath(`/courses/${quiz.lesson.courseId}/lessons/${quiz.lessonId}`);

    return { success: true, score, quizResultId: quizResult.id };
  } catch (error) {
    return { error: 'Error al enviar el quiz' };
  }
}

export async function deleteQuizResult(quizResultId: string) {
  try {
    await prisma.quizResult.delete({
      where: { id: quizResultId },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar el resultado' };
  }
}

export async function resetQuizResultsForUserInCourse(userId: string, courseId: string) {
  try {
    // Find all quizzes in this course
    const quizzes = await prisma.quiz.findMany({
      where: {
        lesson: {
          courseId: courseId
        }
      },
      select: { id: true }
    });

    const quizIds = quizzes.map(q => q.id);

    if (quizIds.length > 0) {
      await prisma.quizResult.deleteMany({
        where: {
          userId: userId,
          quizId: { in: quizIds }
        }
      });
    }

    return { success: true };
  } catch (error) {
    return { error: 'Error al reiniciar resultados del curso' };
  }
}
