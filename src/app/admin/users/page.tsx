import { Search } from 'lucide-react';
import { getCurrentUser, listUsers, updateUserRole, deleteUser } from '@/actions/users';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');
}

interface AdminUsersPageProps {
  searchParams?: {
    search?: string;
  };
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireAdmin();
  const search = searchParams?.search || '';
  const usersResult = await listUsers({ search, limit: 20 });

  async function handleRoleChange(formData: FormData) {
    'use server';
    const userId = formData.get('userId');
    const role = formData.get('role');
    if (typeof userId === 'string' && (role === 'ADMIN' || role === 'EMPLOYEE')) {
      await updateUserRole(userId, role);
    }
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const userId = formData.get('userId');
    if (typeof userId === 'string') {
      await deleteUser(userId);
    }
  }

  if ('error' in usersResult) {
    return <div className="p-8 text-center text-red-600">Error al cargar usuarios</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
            <p className="text-slate-500">Gestiona el acceso y progreso de los empleados.</p>
          </div>
          <form className="relative" method="get">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar usuario..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
            />
          </form>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Nombre</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Rol</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersResult.users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}

              {usersResult.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name || 'Sin nombre'}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <form action={handleRoleChange} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="EMPLOYEE">Empleado</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                        aria-label="Actualizar rol"
                      >
                        Guardar
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={handleDelete}>
                      <input type="hidden" name="userId" value={user.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline"
                        aria-label={`Eliminar ${user.name || user.email}`}
                      >
                        Eliminar
                      </button>
                    </form>
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
