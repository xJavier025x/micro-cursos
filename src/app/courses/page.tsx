import Link from 'next/link';
import { Clock, Book, BookOpen } from 'lucide-react';
import { getCoursesWithProgress } from '@/actions/courses';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';

export default async function CoursesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const result = await getCoursesWithProgress(user.id);

  if ('error' in result) {
    return <div className="p-8 text-center text-red-600">Error al cargar los cursos</div>;
  }

  const { courses } = result;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">Micro-Cursos</Link>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium">
            Dashboard
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-200 transition-colors">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Catálogo de Cursos</h2>
          <p className="text-slate-500">Explora y aprende nuevas habilidades en minutos.</p>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No hay cursos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 bg-slate-200 flex items-center justify-center text-slate-400">
                  <Book size={40} />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{course.title}</h4>
                  <p className="text-slate-500 text-sm mb-4 flex-1 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{course.totalLessons} Lecciones</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="flex items-center gap-1 text-blue-600 font-medium">
                        <span>{course.progress}% Completado</span>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/courses/${course.id}`} 
                    className="block w-full text-center bg-slate-100 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {course.progress > 0 ? 'Continuar' : 'Empezar Curso'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
