'use client';

import { getUserQuizResults } from '@/actions/quizzes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserQuizResults().then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando resultados...</div>;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Resultados</h1>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay resultados aún</h3>
            <p className="text-slate-500 mt-2">Completa algunas lecciones para ver tus resultados aquí.</p>
            <Link href="/courses" className="inline-block mt-4 text-blue-600 hover:underline font-medium">
              Ir a Cursos
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="block bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-blue-600 font-medium mb-1">
                      {result.quiz.lesson.course.title}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {result.quiz.lesson.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`text-2xl font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.score}%
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      {result.score >= 70 ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} /> Aprobado
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircle size={16} /> Reprobado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
