export type LinkType = 'url' | 'image' | 'video' | 'folder' | 'contact' | 'poll';

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  type: LinkType;
  position: number;
  is_active: boolean;
  is_nsfw?: boolean;
  requires_email?: boolean;
  folder_links?: string[];
  form_fields?: FormField[];
  poll_options?: PollOption[];
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}