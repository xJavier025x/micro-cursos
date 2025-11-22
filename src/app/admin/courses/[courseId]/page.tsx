import Link from 'next/link';
import { ChevronLeft, Users, BookOpen, BarChart3, Edit, List } from 'lucide-react';
import { getCourseAnalytics } from '@/actions/dashboards';
import { getCourseById } from '@/actions/courses';

export default async function CourseStatsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const [analytics, course] = await Promise.all([
    getCourseAnalytics(courseId),
    getCourseById(courseId)
  ]);

  if ('error' in analytics || !course) {
    return <div className="p-8 text-center text-red-600">Error al cargar estadísticas del curso</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6">
          <ChevronLeft size={20} />
          Volver a Cursos
        </Link>

        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="text-slate-500 mt-1">Estadísticas y gestión del curso.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href={`/admin/courses/${courseId}/lessons`}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <List size={18} />
              Gestionar Lecciones
            </Link>
            <Link 
              href={`/admin/courses/${courseId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit size={18} />
              Editar Detalles
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Completado por</h3>
              <Users className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.completedCourseCount}</p>
            <p className="text-sm text-slate-400 mt-2">Usuarios</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Total Lecciones</h3>
              <BookOpen className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.totalLessons}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium">Promedio Quiz</h3>
              <BarChart3 className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analytics.averageScore}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Distribución de Progreso</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
             <div className="p-4 bg-slate-50 rounded-lg">
               <p className="text-2xl font-bold text-slate-700">{analytics.progressDistribution?.zero || 0}</p>
               <p className="text-sm text-slate-500">Sin Iniciar</p>
             </div>
             <div className="p-4 bg-blue-50 rounded-lg">
               <p className="text-2xl font-bold text-blue-700">{analytics.progressDistribution?.inProgress || 0}</p>
               <p className="text-sm text-blue-500">En Progreso</p>
             </div>
             <div className="p-4 bg-green-50 rounded-lg">
               <p className="text-2xl font-bold text-green-700">{analytics.progressDistribution?.completed || 0}</p>
               <p className="text-sm text-green-500">Completado</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
