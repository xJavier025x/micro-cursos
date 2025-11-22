import Link from 'next/link';
import { ChevronLeft, Save, FileText } from 'lucide-react';

export default async function EditLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href={`/admin/courses/${courseId}/lessons`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
            <ChevronLeft size={20} />
            Volver
          </Link>
          <Link 
            href={`/admin/courses/${courseId}/lessons/${lessonId}/quiz`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileText size={18} />
            Gestionar Quiz
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Editar Lección {lessonId}</h1>

          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Título de la Lección
              </label>
              <input
                type="text"
                id="title"
                defaultValue={`Lección ${lessonId}`}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-700 mb-1">
                URL del Video (Opcional)
              </label>
              <input
                type="url"
                id="videoUrl"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                Contenido (Markdown)
              </label>
              <textarea
                id="content"
                rows={8}
                defaultValue="Contenido existente..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
