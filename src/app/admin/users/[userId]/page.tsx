import Link from 'next/link';
import { ChevronLeft, Mail, Calendar, Award } from 'lucide-react';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

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
                U{userId}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Empleado {userId}</h1>
                <div className="flex items-center gap-4 mt-2 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail size={16} /> empleado{userId}@empresa.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={16} /> Unido: 20 Nov 2024
                  </span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm">
              Employee
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
                <th className="px-6 py-4 font-semibold text-slate-700">Calificación Promedio</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Última Actividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2].map((i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Curso de Ejemplo {i}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${i === 1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {i === 1 ? 'Completado' : 'En Progreso'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: i === 1 ? '100%' : '45%' }}></div>
                      </div>
                      <span className="text-xs text-slate-500">{i === 1 ? '100%' : '45%'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {i === 1 ? '95/100' : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">Hace 2 días</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
