import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CreateLessonForm } from '@/components/admin/CreateLessonForm';

export default async function NewLessonPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/admin/courses/${courseId}/lessons`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Cancelar
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Nueva Lección</h1>
          <CreateLessonForm courseId={courseId} />
        </div>
      </div>
    </div>
  );
}
