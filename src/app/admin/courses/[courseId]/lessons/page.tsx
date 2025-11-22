import Link from 'next/link';
import { ChevronLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react';

export default async function LessonManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/admin/courses/${courseId}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Volver al Curso
        </Link>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Lecciones del Curso</h1>
            <p className="text-slate-500">Organiza y edita el contenido.</p>
          </div>
          <Link 
            href={`/admin/courses/${courseId}/lessons/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nueva Lección
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div className="text-slate-400 cursor-move">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">Lección {i}: Título de la lección</h3>
                  <p className="text-sm text-slate-500">Video • 5 min</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/admin/courses/${courseId}/lessons/${i}`}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
