'use client';

import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { createCourse } from '@/actions/courses';
import { useActionState } from 'react';

const initialState = {
  error: null as any,
};

export default function NewCoursePage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await createCourse(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { error: null };
  }, initialState);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Cancelar y Volver
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Crear Nuevo Curso</h1>

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Título del Curso
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Ej: Seguridad Informática Básica"
                required
                minLength={3}
              />
              {state.error?.title && (
                <p className="text-red-500 text-sm mt-1">{state.error.title[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Describe de qué trata este curso..."
                required
                minLength={10}
              />
              {state.error?.description && (
                <p className="text-red-500 text-sm mt-1">{state.error.description[0]}</p>
              )}
            </div>

            {typeof state.error === 'string' && (
               <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                 {state.error}
               </div>
            )}

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/admin/courses" className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={isPending}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isPending ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
