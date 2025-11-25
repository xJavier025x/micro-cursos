'use client';

import { getCourseById, updateCourse } from '@/actions/courses';
import { Course } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
        setCourseId(p.courseId);
        getCourseById(p.courseId).then((c) => {
            if (c) setCourse(c);
            setLoading(false);
        });
    });
  }, [params]);

  async function handleSubmit(formData: FormData) {
    if (!courseId) return;
    setSaving(true);
    setError(null);

    const res = await updateCourse(courseId, formData);

    if (res?.error) {
      if (typeof res.error === 'string') {
        setError(res.error);
      } else {
        setError('Error de validación');
      }
      setSaving(false);
    } else {
      router.push('/admin/courses');
      router.refresh();
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!course) return <div className="p-8 text-center">Curso no encontrado</div>;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/courses" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Editar Curso</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título del Curso
              </label>
              <input
                type="text"
                name="title"
                defaultValue={course.title}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={course.description}
                required
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
