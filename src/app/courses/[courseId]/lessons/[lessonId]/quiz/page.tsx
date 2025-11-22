import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getQuizByLessonId } from '@/actions/quizzes';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import QuizRunner from '@/components/QuizRunner';

export default async function QuizPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const quiz = await getQuizByLessonId(lessonId);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Quiz no disponible</h2>
          <p className="text-slate-500 mb-6">Esta lección no tiene un quiz asignado todavía.</p>
          <Link 
            href={`/courses/${courseId}/lessons/${lessonId}`}
            className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la Lección
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href={`/courses/${courseId}/lessons/${lessonId}`} className="text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Quiz: Lección {lessonId}</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <QuizRunner 
          quiz={quiz} 
          userId={user.id} 
          courseId={courseId} 
          lessonId={lessonId} 
        />
      </main>
    </div>
  );
}
