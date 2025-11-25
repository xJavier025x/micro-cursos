import Link from 'next/link';
import { ChevronLeft, Mail, Calendar } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getUserDashboardData } from '@/actions/dashboards';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return <div className="p-8 text-center">Usuario no encontrado</div>;
  }

  const dashboardData = await getUserDashboardData(userId);
  const courses = 'error' in dashboardData ? [] : dashboardData.courses;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/users" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Volver a Usuarios
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.name || `Usuario ${user.id}`}</h1>
                <div className="flex items-center gap-4 mt-2 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail size={16} /> {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} /> Unido: {user.createdAt.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 font-semibold rounded-full text-sm ${
              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Progreso de Cursos</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Curso</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Avance</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Lecciones</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Última Actividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.progress === 100 ? 'bg-green-100 text-green-700' : 
                      course.progress > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {course.progress === 100 ? 'Completado' : course.progress > 0 ? 'En Progreso' : 'Sin Iniciar'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500">{course.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {course.completedLessons} / {course.totalLessons}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    -
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No hay cursos asignados o iniciados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
