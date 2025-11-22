'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createCourse, updateCourse } from '@/actions/courses';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: string;
  initialData?: {
    title?: string;
    description?: string;
  };
}

interface FormState {
  error?: unknown;
  success?: boolean;
}

function buildAction(mode: 'create' | 'edit', courseId?: string) {
  return async (_: FormState, formData: FormData): Promise<FormState> => {
    if (mode === 'edit' && courseId) {
      const result = await updateCourse(courseId, formData);
      if (result?.error) {
        return { error: result.error };
      }
      return { success: true };
    }

    const result = await createCourse(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return {};
  };
}

export function CourseForm({ mode, courseId, initialData }: CourseFormProps) {
  const [state, formAction] = useFormState<FormState>(buildAction(mode, courseId), {});
  const router = useRouter();

  useEffect(() => {
    if (state.success && mode === 'edit') {
      router.push('/admin/courses');
      router.refresh();
    }
  }, [state.success, mode, router]);

  function normalizeError(error?: unknown) {
    if (typeof error === 'string') return error;
    if (!error || typeof error !== 'object') return null;

    const values = Object.values(error as Record<string, string[]>);
    const first = values.flat?.()[0];
    return first || 'Error desconocido';
  }

  const errorMessage = normalizeError(state.error);

  return (
    <form action={formAction} className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{errorMessage}</div>
      )}

      {state.success && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">Curso actualizado correctamente</div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
        <input
          type="text"
          name="title"
          required
          minLength={3}
          defaultValue={initialData?.title || ''}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea
          name="description"
          required
          minLength={10}
          defaultValue={initialData?.description || ''}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
        />
      </div>

      <div className="pt-2">
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <Save size={18} />
      {pending ? 'Guardando...' : mode === 'edit' ? 'Actualizar Curso' : 'Crear Curso'}
    </button>
  );
}
