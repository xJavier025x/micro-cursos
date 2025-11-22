'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- 4.1 Read Actions ---

export async function getQuizByLessonId(lessonId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { id: 'asc' }, // Or any other order
        },
      },
    });
    return quiz;
  } catch (error) {
    return null;
  }
}

export async function getQuizById(quizId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
    return quiz;
  } catch (error) {
    return null;
  }
}

// --- 4.2 Write Actions (ADMIN) ---

export async function deleteQuiz(quizId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { lesson: true }
    });

    if (!quiz) return { error: 'Quiz no encontrado' };

    await prisma.quiz.delete({
      where: { id: quizId },
    });
    
    const { courseId } = quiz.lesson;
    revalidatePath(`/admin/courses/${courseId}/lessons/${quiz.lessonId}/quiz`);
    revalidatePath(`/courses/${courseId}/lessons/${quiz.lessonId}/quiz`);
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar el quiz' };
  }
}

// Helper to save full quiz structure (from previous implementation, kept for utility)
const questionSchema = z.object({
  text: z.string().min(5),
  options: z.array(z.object({
    text: z.string().min(1),
    isCorrect: z.boolean(),
  })).min(2),
});

const quizSchema = z.array(questionSchema);



export async function saveQuiz(lessonId: string, questions: any[]) {
  const result = quizSchema.safeParse(questions);
  
  if (!result.success) {
    return { error: 'Datos del quiz inválidos' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingQuiz = await tx.quiz.findUnique({ where: { lessonId } });

      if (existingQuiz) {
        await tx.question.deleteMany({ where: { quizId: existingQuiz.id } });
        for (const q of result.data) {
          await tx.question.create({
            data: {
              text: q.text,
              quizId: existingQuiz.id,
              options: { create: q.options },
            },
          });
        }
      } else {
        await tx.quiz.create({
          data: {
            lessonId,
            questions: {
              create: result.data.map(q => ({
                text: q.text,
                options: { create: q.options }
              }))
            }
          }
        });
      }
    });

    revalidatePath(`/admin/courses/[courseId]/lessons/${lessonId}/quiz`);
    return { success: true };
  } catch (error) {
    return { error: 'Error al guardar el quiz' };
  }
}

// --- 4.3 User Actions ---

export async function submitQuiz(quizId: string, answers: Record<string, string>, userId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
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

    await prisma.quizResult.create({
      data: {
        userId,
        quizId,
        score,
        answers: {
          create: quiz.questions.flatMap(q => {
            const optionId = answers[q.id];
            return optionId ? [{ questionId: q.id, optionId }] : [];
          })
        }
      }
    });

    return { success: true, score };
  } catch (error) {
    return { error: 'Error al enviar el quiz' };
  }
}

export async function getUserQuizResults() {
  try {
    const session = (await cookies()).get('session')?.value;
    if (!session) return [];

    const results = await prisma.quizResult.findMany({
      where: { userId: session },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return results;
  } catch (error) {
    return [];
  }
}

export async function getQuizResultById(id: string) {
  try {
    const result = await prisma.quizResult.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            lesson: {
              select: { title: true }
            },
            questions: {
              include: { options: true }
            }
          }
        },
        answers: true
      }
    });
    return result;
  } catch (error) {
    return null;
  }
}
