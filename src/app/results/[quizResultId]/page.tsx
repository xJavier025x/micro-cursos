'use client';

import { getQuizResultById } from '@/actions/quizzes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function ResultDetailPage({ params }: { params: Promise<{ quizResultId: string }> }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
        getQuizResultById(p.quizResultId).then((data) => {
            setResult(data);
            setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="p-8 text-center">Cargando detalle...</div>;
  if (!result) return <div className="p-8 text-center">Resultado no encontrado</div>;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/results" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft size={20} />
          Volver a Resultados
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
          <div className="p-8 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Resultado: {result.quiz.lesson.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold ${result.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                {result.score}%
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {result.score >= 70 ? 'Aprobado' : 'Reprobado'}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {result.quiz.questions.map((question: any, index: number) => {
              const userAnswer = result.answers.find((a: any) => a.questionId === question.id);
              const userOptionId = userAnswer?.optionId;
              const isCorrect = question.options.find((o: any) => o.id === userOptionId)?.isCorrect;

              return (
                <div key={question.id} className="border-b border-slate-100 last:border-0 pb-8 last:pb-0">
                  <div className="flex gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-slate-900">{question.text}</h3>
                    </div>
                    {isCorrect ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-3 pl-11">
                    {question.options.map((option: any) => {
                      const isSelected = option.id === userOptionId;
                      const isOptionCorrect = option.isCorrect;
                      
                      let optionClass = "p-4 rounded-lg border transition-colors flex justify-between items-center ";
                      
                      if (isSelected && isOptionCorrect) {
                        optionClass += "bg-green-50 border-green-200 text-green-800";
                      } else if (isSelected && !isOptionCorrect) {
                        optionClass += "bg-red-50 border-red-200 text-red-800";
                      } else if (isOptionCorrect) {
                        optionClass += "bg-green-50 border-green-200 text-green-800 opacity-75"; // Show correct answer if missed
                      } else {
                        optionClass += "bg-white border-slate-200 text-slate-600";
                      }

                      return (
                        <div key={option.id} className={optionClass}>
                          <span>{option.text}</span>
                          {isSelected && <span className="text-xs font-bold uppercase tracking-wider">Tu respuesta</span>}
                          {!isSelected && isOptionCorrect && <span className="text-xs font-bold uppercase tracking-wider">Correcta</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
