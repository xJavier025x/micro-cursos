import Link from 'next/link';
import { Users, BookOpen, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { getAdminDashboardMetrics } from '@/actions/dashboards';

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  if ('error' in metrics) {
    return <div className="p-8 text-center text-red-600">Error al cargar el dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white">
            <TrendingUp size={20} />
            Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <BookOpen size={20} />
            Cursos
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            Usuarios
          </Link>
          {/* Settings link removed as page doesn't exist yet */}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-medium">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Resumen General</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Usuarios Totales</h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{metrics.usersCount}</p>
            <div className="mt-2 text-sm text-slate-500">
              {metrics.usersByRole?.EMPLOYEE || 0} Estudiantes | {metrics.usersByRole?.ADMIN || 0} Admins
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Cursos Publicados</h3>
              <BookOpen className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{metrics.coursesCount}</p>
            <p className="text-sm text-slate-400 mt-2">{metrics.lessonsCount} Lecciones en total</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Promedio General Quiz</h3>
              <BarChart3 className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{metrics.averageScore}%</p>
            <p className="text-sm text-slate-400 mt-2">Basado en {metrics.quizResultsCount} resultados</p>
          </div>
        </div>
      </main>
    </div>
  );
}
