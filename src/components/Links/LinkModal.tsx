import { Dialog } from '@headlessui/react';
import { X, Link as LinkIcon, Image, Video, Folder, Mail, BarChart2 } from 'lucide-react';
import { Link, LinkType } from '../../types/link';
import { LinkForm } from './LinkForm';
import { useState } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link?: Link | null;
}

const LINK_TYPES: Array<{
  id: LinkType;
  name: string;
  icon: typeof LinkIcon;
  description: string;
}> = [
  { id: 'url', name: 'Standard URL', icon: LinkIcon, description: 'Add any web link' },
  { id: 'image', name: 'Image', icon: Image, description: 'Upload or link to images' },
  { id: 'video', name: 'Video', icon: Video, description: 'Upload or embed videos' },
  { id: 'folder', name: 'Folder', icon: Folder, description: 'Group multiple links together' },
  { id: 'contact', name: 'Contact Form', icon: Mail, description: 'Add a contact form' },
  { id: 'poll', name: 'Poll', icon: BarChart2, description: 'Create interactive polls' },
];

export function LinkModal({ isOpen, onClose, link }: LinkModalProps) {
  const [selectedType, setSelectedType] = useState<LinkType | null>(link?.type || null);

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-semibold">
              {link ? 'Edit Link' : selectedType ? LINK_TYPES.find(t => t.id === selectedType)?.name : 'Choose Link Type'}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            {!selectedType && !link ? (
              <div className="grid grid-cols-2 gap-4">
                {LINK_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className="flex flex-col items-center p-4 text-center rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <type.icon className="h-8 w-8 text-indigo-600 mb-2" />
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <LinkForm
                initialData={link}
                linkType={selectedType || undefined}
                onClose={handleClose}
              />
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}