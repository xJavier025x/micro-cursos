import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-blue-600">
          Micro-Cursos
        </h1>
        <p className="text-xl text-slate-600 max-w-md">
          Plataforma de aprendizaje continuo para empleados. Lecciones cortas, progreso real.
        </p>
        
        <div className="flex gap-4">
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
            <ArrowRight size={20} />
          </Link>
        </div>
      </main>
      
      <footer className="absolute bottom-4 text-sm text-slate-400">
        © {new Date().getFullYear()} Empresa S.A.
      </footer>
    </div>
  );
}
