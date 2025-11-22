'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- Schemas ---
const questionSchema = z.object({
  text: z.string().min(3, "El texto de la pregunta debe tener al menos 3 caracteres"),
});

const optionSchema = z.object({
  text: z.string().min(1, "El texto de la opción no puede estar vacío"),
  isCorrect: z.boolean().optional(),
});

// --- 5.1 Lectura ---

export async function getQuestionsByQuiz(quizId: string) {
  try {
    const questions = await prisma.question.findMany({
      where: { quizId },
      include: {
        options: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return questions;
  } catch (error) {
    return [];
  }
}

export async function getQuestionById(questionId: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
      },
    });
    return question;
  } catch (error) {
    return null;
  }
}

// --- 5.2 Escritura (ADMIN) - Question ---

export async function createQuestion(quizId: string, formData: FormData) {
  const text = formData.get('text') as string;
  const result = questionSchema.safeParse({ text });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.question.create({
      data: {
        text: result.data.text,
        quizId,
      },
    });
    
    // Revalidate paths where this quiz might be shown
    // Assuming we might need to revalidate the quiz management page
    // We don't have the courseId and lessonId easily available here without fetching, 
    // but usually this action is called from a context where we might know.
    // For now, generic revalidation or specific if we pass more data.
    // Ideally we should pass courseId and lessonId to revalidate the specific page.
    // But since the prompt signature is (quizId, data), we'll do best effort or just return success.
    
    return { success: true };
  } catch (error) {
    return { error: 'Error al crear la pregunta' };
  }
}

export async function updateQuestion(questionId: string, formData: FormData) {
  const text = formData.get('text') as string;
  const result = questionSchema.safeParse({ text });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.question.update({
      where: { id: questionId },
      data: {
        text: result.data.text,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar la pregunta' };
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar la pregunta' };
  }
}

// --- 5.3 Escritura (ADMIN) - Option ---

export async function createOption(questionId: string, formData: FormData) {
  const text = formData.get('text') as string;
  const isCorrect = formData.get('isCorrect') === 'on'; // Checkbox handling
  
  const result = optionSchema.safeParse({ text, isCorrect });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.option.create({
      data: {
        text: result.data.text,
        isCorrect: result.data.isCorrect || false,
        questionId,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al crear la opción' };
  }
}

export async function updateOption(optionId: string, formData: FormData) {
  const text = formData.get('text') as string;
  // If isCorrect is not present in formData, it might mean it's unchecked OR we are just updating text.
  // Usually for updates we might want to be explicit. 
  // Let's assume if 'isCorrect' key exists in formData we update it, otherwise we might keep it?
  // Or standard form submission: unchecked checkbox sends nothing.
  // Let's assume standard form behavior: if we are updating the option, we probably send the full state.
  const isCorrect = formData.get('isCorrect') === 'on'; 
  
  const result = optionSchema.safeParse({ text, isCorrect });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    await prisma.option.update({
      where: { id: optionId },
      data: {
        text: result.data.text,
        isCorrect: result.data.isCorrect,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al actualizar la opción' };
  }
}

export async function deleteOption(optionId: string) {
  try {
    await prisma.option.delete({
      where: { id: optionId },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar la opción' };
  }
}

export async function setCorrectOptions(questionId: string, optionIds: string[]) {
  try {
    await prisma.$transaction(async (tx) => {
      // First, set all options for this question to false
      await tx.option.updateMany({
        where: { questionId },
        data: { isCorrect: false },
      });

      // Then set the specified options to true
      if (optionIds.length > 0) {
        await tx.option.updateMany({
          where: { 
            questionId,
            id: { in: optionIds }
          },
          data: { isCorrect: true },
        });
      }
    });
    return { success: true };
  } catch (error) {
    return { error: 'Error al establecer opciones correctas' };
  }
}
