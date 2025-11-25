import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';
import { getLessonById } from '@/actions/lessons';
import { EditLessonForm } from '@/components/admin/EditLessonForm';

export default async function EditLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return <div className="p-8 text-center">Lección no encontrada</div>;
  }

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
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Editar: {lesson.title}</h1>
          <EditLessonForm courseId={courseId} lesson={lesson} />
        </div>
      </div>
    </div>
  );
}
