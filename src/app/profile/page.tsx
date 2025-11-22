'use client';

import { getCurrentUser, updateUserProfile, changeUserPassword } from '@/actions/users';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Lock, Save } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
      if (!u) {
        router.replace('/auth/login');
      }
    });
  }, [router]);

  async function handleUpdateProfile(formData: FormData) {
    if (!user?.id) return;
    const res = await updateUserProfile(user.id, formData);
    if (res?.error) {
      setMessage({ type: 'error', text: typeof res.error === 'string' ? res.error : 'Error al actualizar' });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    }
  }

  async function handleChangePassword(formData: FormData) {
    if (!user?.id) return;
    const res = await changeUserPassword(user.id, formData);
    if (res?.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      (document.getElementById('password-form') as HTMLFormElement).reset();
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!user) return <div className="p-8 text-center">Redirigiendo...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>

        {message && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 text-slate-800">
            <UserIcon className="text-blue-600" />
            <h2 className="text-xl font-semibold">Información Personal</h2>
          </div>
          
          <form action={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                defaultValue={user.name || ''}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={user.email || ''}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="pt-2">
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 text-slate-800">
            <Lock className="text-blue-600" />
            <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
          </div>

          <form id="password-form" action={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
              <input
                type="password"
                name="currentPassword"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="pt-2">
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
                <Save size={18} />
                Actualizar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
