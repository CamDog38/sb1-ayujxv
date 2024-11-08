import { useState } from 'react';
import { Plus } from 'lucide-react';
import { LinkList } from './LinkList';
import { LinkModal } from './LinkModal';

export function LinksTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Your Links</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Link
        </button>
      </div>

      <LinkList />

      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}