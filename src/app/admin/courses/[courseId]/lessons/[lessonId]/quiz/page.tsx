import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import QuizEditor from '@/components/QuizEditor';
import { getQuizByLessonId } from '@/actions/quizzes';

export default async function QuizManagementPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const quiz = await getQuizByLessonId(lessonId);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={`/admin/courses/${courseId}/lessons/${lessonId}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Volver a la Lección
        </Link>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestionar Quiz</h1>
            <p className="text-slate-500">Lección {lessonId}</p>
          </div>
        </header>

        <QuizEditor 
          lessonId={lessonId} 
          initialQuestions={quiz?.questions as any} 
        />
      </div>
    </div>
  );
}
