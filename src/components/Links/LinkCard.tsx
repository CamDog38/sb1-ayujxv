import { useState } from 'react';
import { Link as LinkIcon, Pencil, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { Link } from '../../types/link';
import { cn } from '../../lib/utils';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  isUnsaved?: boolean;
  dragHandleProps?: any;
}

export function LinkCard({ link, onEdit, isUnsaved, dragHandleProps }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4',
        'transition-all duration-200 ease-in-out',
        isHovered && 'shadow-md scale-[1.01]',
        isUnsaved && 'border-indigo-300 bg-indigo-50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing p-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-start ml-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {link.title}
              {isUnsaved && (
                <span className="ml-2 text-xs text-indigo-600">(Unsaved)</span>
              )}
            </h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {link.description && (
            <p className="mt-1 text-sm text-gray-500 truncate">{link.description}</p>
          )}
        </div>

        <div className={cn(
          'flex items-center space-x-2 opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200'
        )}>
          <button
            onClick={() => onEdit(link)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}