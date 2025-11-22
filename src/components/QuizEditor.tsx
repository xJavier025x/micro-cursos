'use client';

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { saveQuiz } from '@/actions/quizzes';
import { useRouter } from 'next/navigation';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  options: Option[];
}

interface QuizEditorProps {
  lessonId: string;
  initialQuestions?: Question[];
}

export default function QuizEditor({ lessonId, initialQuestions = [] }: QuizEditorProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions.length > 0 
      ? initialQuestions 
      : [{ text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }
    ]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setQuestions(newQuestions);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    // Reset all options for this question
    newQuestions[qIndex].options.forEach(opt => opt.isCorrect = false);
    // Set the selected one
    newQuestions[qIndex].options[oIndex].isCorrect = true;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Basic validation
    for (const q of questions) {
      if (!q.text.trim()) {
        setError('Todas las preguntas deben tener texto.');
        setIsSaving(false);
        return;
      }
      if (q.options.length < 2) {
        setError('Cada pregunta debe tener al menos 2 opciones.');
        setIsSaving(false);
        return;
      }
      if (!q.options.some(o => o.isCorrect)) {
        setError('Cada pregunta debe tener una respuesta correcta marcada.');
        setIsSaving(false);
        return;
      }
      if (q.options.some(o => !o.text.trim())) {
        setError('Todas las opciones deben tener texto.');
        setIsSaving(false);
        return;
      }
    }

    const result = await saveQuiz(lessonId, questions);

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
      // Optional: Show success toast or redirect
      alert('Quiz guardado correctamente');
    }
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-8">
        <button 
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Agregar Pregunta
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900">Pregunta {qIndex + 1}</h3>
              <button 
                onClick={() => removeQuestion(qIndex)}
                className="text-slate-400 hover:text-red-600 transition-colors"
                title="Eliminar pregunta"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Escribe la pregunta aquí..."
              />

              <div className="pl-4 space-y-3 border-l-2 border-slate-100">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name={`q${qIndex}_correct`} 
                      className="w-4 h-4 text-blue-600 cursor-pointer" 
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(qIndex, oIndex)}
                      title="Marcar como correcta"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                      className={`flex-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${opt.isCorrect ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                      placeholder={`Opción ${oIndex + 1}`}
                    />
                    <button 
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-slate-300 hover:text-red-500"
                      disabled={q.options.length <= 2}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addOption(qIndex)}
                  className="text-sm text-blue-600 font-medium hover:underline pl-7"
                >
                  + Agregar Opción
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {isSaving ? 'Guardando...' : 'Guardar Quiz Completo'}
        </button>
      </div>
    </div>
  );
}
