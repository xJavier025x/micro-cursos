import { getCurrentUser } from '@/actions/users';
import { redirect } from 'next/navigation';
import { CourseForm } from '@/components/admin/CourseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');
}

export default async function NewCoursePage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <ArrowLeft size={18} />
          Volver a cursos
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Crear nuevo curso</h1>
          <CourseForm mode="create" />
        </div>
      </div>
    </div>
  );
}
