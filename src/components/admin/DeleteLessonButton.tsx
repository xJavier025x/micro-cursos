'use client';

import { Trash2 } from 'lucide-react';
import { deleteLesson } from '@/actions/lessons';

interface Props {
  id: string;
  courseId: string;
}

export const DeleteLessonButton = ({ id, courseId }: Props) => {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
      await deleteLesson(id, courseId);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Eliminar lección"
    >
      <Trash2 size={18} />
    </button>
  );
};
