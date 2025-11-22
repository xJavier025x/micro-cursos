import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { listCourses, deleteCourse } from '@/actions/courses';
import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export default async function AdminCoursesPage() {
  await requireAdmin();
  const coursesResult = await listCourses();

  async function handleDelete(formData: FormData) {
    'use server';
    const courseId = formData.get('courseId');
    if (typeof courseId === 'string') {
      await deleteCourse(courseId);
    }
  }

  if ('error' in coursesResult) {
    return <div className="p-8 text-center text-red-600">Error al cargar los cursos</div>;
  }

  const courses = coursesResult.courses;

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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
                <th className="px-6 py-4 font-semibold text-slate-700">Fecha Creación</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                    Aún no hay cursos creados.
                  </td>
                </tr>
              )}

              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{course.title}</div>
                    <div className="text-sm text-slate-500">{course.description}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{course._count.lessons} Lecciones</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(course.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/courses/${course.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </Link>
                      <form action={handleDelete}>
                        <input type="hidden" name="courseId" value={course.id} />
                        <button
                          type="submit"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Eliminar ${course.title}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
