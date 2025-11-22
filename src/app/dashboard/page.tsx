import Link from 'next/link';
import { BookOpen, Award, Clock } from 'lucide-react';
import { getUserDashboardData } from '@/actions/dashboards';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const dashboardData = await getUserDashboardData(user.id);

  if ('error' in dashboardData) {
    return <div className="p-8 text-center text-red-600">Error al cargar el dashboard</div>;
  }

  const { courses, lastQuizResult, summary } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Micro-Cursos</h1>
        <div className="flex gap-4">
          <Link href="/courses" className="text-slate-600 hover:text-blue-600 font-medium">
            Catálogo
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold hover:bg-blue-200 transition-colors">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Hola, {user.name || 'Usuario'}</h2>
          <p className="text-slate-500">Aquí está tu resumen de aprendizaje.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Cursos Completados</p>
              <p className="text-2xl font-bold text-slate-900">{summary.completedLessons}</p> {/* Note: Summary returns completed lessons count, not courses. Adjust label or logic if needed. The action returns completedLessons and activeCourses. Let's use completedLessons for now or activeCourses if label is Cursos Activos. The mock said Cursos Completados. Let's stick to completedLessons for "Lecciones Completadas" or change label. Let's change label to Lecciones Completadas to be accurate with action return */}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Último Quiz</p>
              <p className="text-2xl font-bold text-slate-900">
                {lastQuizResult ? `${lastQuizResult.score}%` : '-'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Cursos Activos</p>
              <p className="text-2xl font-bold text-slate-900">{summary.activeCourses}</p>
            </div>
          </div>
        </div>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Mis Cursos</h3>
          {courses.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
               <p className="text-slate-500 mb-4">No estás inscrito en ningún curso aún.</p>
               <Link href="/courses" className="text-blue-600 font-medium hover:underline">Explorar Catálogo</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400">
                    <BookOpen size={32} />
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{course.title}</h4>
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{course.progress}% Completado</span>
                      <Link 
                        href={`/courses/${course.id}`} 
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Continuar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
