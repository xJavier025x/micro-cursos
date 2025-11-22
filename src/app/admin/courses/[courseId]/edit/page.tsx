import { getCurrentUser } from '@/actions/users';
import { getCourseById } from '@/actions/courses';
import { redirect } from 'next/navigation';
import { CourseForm } from '@/components/admin/CourseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');
}

interface EditCoursePageProps {
  params: { courseId: string };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  await requireAdmin();
  const course = await getCourseById(params.courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-600">
          <p>No se encontró el curso solicitado.</p>
          <Link href="/admin/courses" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft size={18} /> Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={18} />
          Volver a cursos
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar curso</h1>
          <CourseForm
            mode="edit"
            courseId={course.id}
            initialData={{
              title: course.title,
              description: course.description,
            }}
          />
        </div>
      </div>
    </div>
  );
}
