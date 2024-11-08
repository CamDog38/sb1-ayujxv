import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { LinkModal } from './LinkModal';
import toast from 'react-hot-toast';

export function LinkList() {
  const { links, setLinks, removeLink } = useStore();
  const [editingLink, setEditingLink] = useState(null);
  const [unsavedLinks, setUnsavedLinks] = useState(links);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUnsavedLinks(links);
  }, [links]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(unsavedLinks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setUnsavedLinks(updatedItems);

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('links')
        .upsert(
          updatedItems.map(({ id, position }) => ({
            id,
            position,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'id' }
        );

      if (error) throw error;
      setLinks(updatedItems);
      toast.success('Link order updated');
    } catch (error) {
      console.error('Error updating link order:', error);
      toast.error('Failed to update link order');
      setUnsavedLinks(links); // Revert to original order
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      removeLink(id);
      toast.success('Link deleted');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {Array.isArray(unsavedLinks) && unsavedLinks.map((link, index) => (
                <Draggable
                  key={link.id}
                  draggableId={link.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <LinkIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <span className="font-medium">{link.title}</span>
                          {link.description && (
                            <p className="text-sm text-gray-500">{link.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingLink(link)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          aria-label="Edit link"
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          aria-label="Delete link"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingLink && (
        <LinkModal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          link={editingLink}
        />
      )}
    </div>
  );
}