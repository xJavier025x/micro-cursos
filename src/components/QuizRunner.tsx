'use client';

import { useState } from 'react';
import { submitQuiz } from '@/actions/quizzes';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface QuizRunnerProps {
  quiz: any;
  userId: string;
  courseId: string;
  lessonId: string;
}

export default function QuizRunner({ quiz, userId, courseId, lessonId }: QuizRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOptionChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await submitQuiz(quiz.id, answers, userId);
      if (res.error) {
        setError(res.error);
      } else if (res.success && typeof res.score === 'number') {
        setResult({ score: res.score });
        router.refresh(); // Refresh to update any server-side state if needed
      }
    } catch (e) {
      setError('Error inesperado al enviar el quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Quiz Completado!</h2>
        <p className="text-slate-500 mb-6">Has obtenido una puntuación de:</p>
        <div className="text-5xl font-bold text-blue-600 mb-8">{result.score}%</div>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Intentar de nuevo
          </button>
          <button 
            onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la Lección
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="space-y-8 mb-8">
        {quiz.questions.map((question: any, index: number) => (
          <div key={question.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {index + 1}. {question.text}
            </h3>
            <div className="space-y-3">
              {question.options.map((option: any) => (
                <label 
                  key={option.id} 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    answers[question.id] === option.id 
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name={question.id} 
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleOptionChange(question.id, option.id)}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                  />
                  <span className="ml-3 text-slate-700">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length < quiz.questions.length}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Enviar Respuestas'}
        </button>
      </div>
    </div>
  );
}
