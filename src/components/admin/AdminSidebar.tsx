import Link from 'next/link';
import { Users, BookOpen, TrendingUp } from 'lucide-react';

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <TrendingUp size={20} />
          Dashboard
        </Link>
        <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <BookOpen size={20} />
          Cursos
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <Users size={20} />
          Usuarios
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">A</div>
          <div>
            <p className="text-sm font-medium">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
