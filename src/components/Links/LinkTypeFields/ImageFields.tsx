import { useState, useRef } from 'react';
import { Upload, AlertTriangle, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ImageFieldsProps {
  value: any;
  onChange: (values: any) => void;
}

export function ImageFields({ value, onChange }: ImageFieldsProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value.url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // First create a local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

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
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error:', error);
      // Clear preview on error
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onChange({
      ...value,
      url: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        )}
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