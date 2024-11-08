import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import { Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, LinkType } from '../../types/link';
import { ImageFields } from './LinkTypeFields/ImageFields';
import { VideoFields } from './LinkTypeFields/VideoFields';
import { FolderFields } from './LinkTypeFields/FolderFields';
import { ContactFields } from './LinkTypeFields/ContactFields';
import { PollFields } from './LinkTypeFields/PollFields';

interface LinkFormProps {
  initialData?: Link;
  linkType?: LinkType;
  onClose?: () => void;
}

export function LinkForm({ initialData, linkType = 'url', onClose }: LinkFormProps) {
  const { links, addLink, updateLink } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    url: initialData?.url || '',
    description: initialData?.description || '',
    type: linkType,
    is_nsfw: initialData?.is_nsfw || false,
    requires_email: initialData?.requires_email || false,
    folder_links: initialData?.folder_links || [],
    form_fields: initialData?.form_fields || [],
    poll_options: initialData?.poll_options || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Calculate next position
      const nextPosition = links.length > 0 
        ? Math.max(...links.map(link => link.position)) + 1 
        : 0;

      const linkData = {
        ...formData,
        user_id: user.id,
        position: initialData?.position ?? nextPosition,
        is_active: true
      };

      const { data, error } = await supabase
        .from('links')
        .upsert({
          id: initialData?.id,
          ...linkData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (initialData) {
        updateLink(data);
        toast.success('Link updated successfully');
      } else {
        addLink(data);
        toast.success('Link added successfully');
      }

      onClose?.();
    } catch (error: any) {
      toast.error(error.message || 'Error saving link');
      console.error('Error saving link:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'image':
        return (
          <ImageFields
            value={formData}
            onChange={(values) => setFormData(values)}
          />
        );
      case 'video':
        return (
          <VideoFields
            value={formData}
            onChange={(values) => setFormData(values)}
          />
        );
      case 'folder':
        return (
          <FolderFields
            value={formData}
            onChange={(values) => setFormData(values)}
          />
        );
      case 'contact':
        return (
          <ContactFields
            value={formData}
            onChange={(values) => setFormData(values)}
          />
        );
      case 'poll':
        return (
          <PollFields
            value={formData}
            onChange={(values) => setFormData(values)}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  required
                  className="input pl-10"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="input mt-1"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
          <input
            type="text"
            className="input mt-1"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {renderTypeSpecificFields()}
      </div>

      <div className="flex justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Link' : 'Add Link'}
        </button>
      </div>
    </form>
  );
}