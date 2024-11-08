import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2 } from 'lucide-react';
import { Link } from '../../lib/supabase';

interface SortableLinkProps {
  link: Link;
}

export function SortableLink({ link }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
    >
      <button
        className="touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="text-gray-400" />
      </button>
      
      <div className="flex-1">
        <h3 className="font-medium">{link.title}</h3>
        <p className="text-sm text-gray-500">{link.url}</p>
      </div>

      <div className="flex gap-2">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}