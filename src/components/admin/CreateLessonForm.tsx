'use client';

import { useActionState } from 'react';
import { Save } from 'lucide-react';
import { createLesson } from '@/actions/lessons';

interface Props {
  courseId: string;
}

export const CreateLessonForm = ({ courseId }: Props) => {
  const createLessonWithId = createLesson.bind(null, courseId);
  // @ts-ignore
  const [state, action, isPending] = useActionState(createLessonWithId, null);

  return (
    <form action={action} className="space-y-6">
      {state?.error && typeof state.error === 'string' && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Título de la Lección
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Ej: Introducción a..."
        />
        {state?.error && typeof state.error !== 'string' && state.error.title && (
          <p className="text-sm text-red-600 mt-1">{state.error.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-700 mb-1">
          URL del Video (Opcional)
        </label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="https://youtube.com/..."
        />
        {state?.error && typeof state.error !== 'string' && state.error.videoUrl && (
          <p className="text-sm text-red-600 mt-1">{state.error.videoUrl[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
          Contenido (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
          placeholder="# Título..."
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {isPending ? 'Guardando...' : 'Guardar Lección'}
        </button>
      </div>
    </form>
  );
};
