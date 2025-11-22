import Link from 'next/link';
import { ChevronLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { getUserCourseDetail } from '@/actions/dashboards';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const course = await getUserCourseDetail(user.id, courseId);

  if (!course) {
    return <div className="p-8 text-center">Curso no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/courses" className="text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Detalles del Curso</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 bg-blue-600 p-8 flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
            <p className="opacity-90">{course.description}</p>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Contenido del Curso</h3>
              <span className="text-sm text-slate-500">{course.lessons.length} Lecciones</span>
            </div>

            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <Link 
                  key={lesson.id}
                  href={`/courses/${courseId}/lessons/${lesson.id}`}
                  className="flex items-center p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <div className="mr-4 text-slate-400 group-hover:text-blue-500">
                    {lesson.isCompleted ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <PlayCircle size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-700">
                      Lección {index + 1}: {lesson.title}
                    </h4>
                    {lesson.hasQuiz && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Quiz
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {lesson.isCompleted ? 'Repasar' : 'Iniciar'}
                  </div>
                </Link>
              ))}
              {course.lessons.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No hay lecciones disponibles aún.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
