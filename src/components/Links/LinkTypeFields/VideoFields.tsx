import { useState } from 'react';
import { Upload, Link, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface VideoFieldsProps {
  value: any;
  onChange: (values: any) => void;
}

export function VideoFields({ value, onChange }: VideoFieldsProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('links')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('links')
        .getPublicUrl(filePath);

      onChange({
        ...value,
        url: publicUrl,
      });
      
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error('Error uploading video');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadType('url')}
          className={`flex-1 py-2 px-4 rounded-lg ${
            uploadType === 'url'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Link className="h-4 w-4 inline-block mr-2" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadType('file')}
          className={`flex-1 py-2 px-4 rounded-lg ${
            uploadType === 'file'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Upload className="h-4 w-4 inline-block mr-2" />
          Upload
        </button>
      </div>

      {uploadType === 'url' ? (
        <input
          type="url"
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder="Enter video URL"
          className="input"
        />
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload video'}
            </span>
          </label>
        </div>
      )}

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