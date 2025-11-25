import Link from 'next/link';
import { ChevronLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import prisma from '@/lib/prisma';
import { DeleteLessonButton } from '@/components/admin/DeleteLessonButton';

export default async function LessonManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  const lessons = await prisma.lesson.findMany({
    where: {
      courseId: courseId
    },
    orderBy: {
      order: 'asc'
    }
  });

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true }
  });

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
            <p className="text-slate-500">
              {course?.title ? `Gestionando: ${course.title}` : 'Organiza y edita el contenido.'}
            </p>
          </div>
          <Link 
            href={`/admin/courses/${courseId}/lessons/new`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus size={20} />
            Nueva Lección
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Lecciones del Curso</h2>
            <p className="text-slate-500 text-sm">Gestiona el contenido y orden de las lecciones.</p>
          </div>
          
          <div className="divide-y divide-slate-100">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <GripVertical size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{lesson.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {lesson.videoUrl ? 'Video incluido' : 'Sin video'} • Orden: {lesson.order}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <DeleteLessonButton id={lesson.id} courseId={courseId} />
                </div>
              </div>
            ))}
            {lessons.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No hay lecciones en este curso.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
