'use client';

import { Trash2 } from 'lucide-react';
import { deleteCourse } from '@/actions/courses';

interface Props {
  id: string;
}

export const DeleteCourseButton = ({ id }: Props) => {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.')) {
      await deleteCourse(id);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
      title="Eliminar curso"
    >
      <Trash2 size={18} />
    </button>
  );
};
