import Link from 'next/link';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import prisma from '@/lib/prisma';
import { DeleteCourseButton } from '@/components/admin/DeleteCourseButton';

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { lessons: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de Cursos</h1>
            <p className="text-slate-500">Administra el catálogo de microcursos.</p>
          </div>
          <Link 
            href="/admin/courses/new" 
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus size={20} />
            Nuevo Curso
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Título</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Lecciones</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Fecha Creación</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{course.title}</div>
                    <div className="text-sm text-slate-500">ID: {course.id.substring(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{course._count.lessons} Lecciones</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success/10 text-success">
                      Publicado
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {course.createdAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/courses/${course.id}`} className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors">
                        <Edit size={18} />
                      </Link>
                      <DeleteCourseButton id={course.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No hay cursos registrados.
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
