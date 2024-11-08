import { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { AlertTriangle } from 'lucide-react';

interface FolderFieldsProps {
  value: any;
  onChange: (values: any) => void;
}

export function FolderFields({ value, onChange }: FolderFieldsProps) {
  const { links } = useStore();
  const [selectedLinks, setSelectedLinks] = useState<string[]>(value.folder_links || []);

  const handleLinkToggle = (linkId: string) => {
    const newSelection = selectedLinks.includes(linkId)
      ? selectedLinks.filter(id => id !== linkId)
      : [...selectedLinks, linkId];
    
    setSelectedLinks(newSelection);
    onChange({
      ...value,
      folder_links: newSelection,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg divide-y">
        {links
          .filter(link => link.type !== 'folder' && link.id !== value.id)
          .map(link => (
            <div
              key={link.id}
              className="flex items-center p-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedLinks.includes(link.id)}
                onChange={() => handleLinkToggle(link.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-3 text-sm text-gray-700">{link.title}</span>
            </div>
          ))}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          id="is_nsfw"
          checked={value.is_nsfw}
          onChange={(e) => onChange({ ...value, is_nsfw: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="is_nsfw" className="text-sm text-gray-700 flex items-center">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
          NSFW Content (will be blurred)
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="requires_email"
          checked={value.requires_email}
          onChange={(e) => onChange({ ...value, requires_email: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="requires_email" className="text-sm text-gray-700">
          Require email to access
        </label>
      </div>
    </div>
  );
}