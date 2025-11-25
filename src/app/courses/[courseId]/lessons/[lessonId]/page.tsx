import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, CheckCircle } from 'lucide-react';
import { getLessonById } from '@/actions/lessons';
import { getLessonProgress, markLessonAsCompleted } from '@/actions/progress';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    return <div className="p-8 text-center">Lección no encontrada</div>;
  }

  const progress = await getLessonProgress(user.id, lessonId);
  const isCompleted = !!progress?.completedAt;

  async function completeLesson() {
    'use server';
    if (user) {
      await markLessonAsCompleted(user.id, lessonId);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href={`/courses/${courseId}`} className="text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{lesson.title}</h1>
            <p className="text-xs text-slate-500">{lesson.course.title}</p>
          </div>
        </div>
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
           {isCompleted && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16}/> Completada</span>}
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {lesson.videoUrl && (
          <div className="aspect-video bg-slate-900 rounded-xl mb-8 flex items-center justify-center text-white overflow-hidden">
             <iframe 
               src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
               className="w-full h-full" 
               allowFullScreen 
               title={lesson.title}
             />
          </div>
        )}

        <article className="prose prose-slate max-w-none mb-12">
          <ReactMarkdown>{lesson.content || ''}</ReactMarkdown>
        </article>
      </main>

      <footer className="border-t border-slate-200 p-6 bg-slate-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900">
            Volver al Curso
          </Link>
          
          <div className="flex gap-3">
             {lesson.quiz && (
               <Link 
                href={`/courses/${courseId}/lessons/${lessonId}/quiz`}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <FileText size={18} />
                Tomar Quiz
              </Link>
             )}
            
            {!isCompleted ? (
              <form action={completeLesson}>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Marcar como Completada
                  <CheckCircle size={18} />
                </button>
              </form>
            ) : (
               <button 
                  disabled
                  className="px-6 py-2 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center gap-2 cursor-default"
                >
                  Completada
                  <CheckCircle size={18} />
                </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
