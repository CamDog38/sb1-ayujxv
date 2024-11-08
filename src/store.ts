import { create } from 'zustand';
import { supabase } from './lib/supabase';

interface Link {
  id: string;
  title: string;
  url: string;
  type: string;
  position: number;
}

interface State {
  links: Link[];
  setLinks: (links: Link[]) => void;
  addLink: (link: Omit<Link, 'id'>) => Promise<void>;
  updateLink: (id: string, link: Partial<Link>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (links: Link[]) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  links: [],
  
  setLinks: (links) => set({ links }),
  
  addLink: async (link) => {
    const { data, error } = await supabase
      .from('links')
      .insert([link])
      .select()
      .single();

    if (error) throw error;
    
    const currentLinks = get().links;
    set({ links: [...currentLinks, data] });
  },
  
  updateLink: async (id, link) => {
    const { error } = await supabase
      .from('links')
      .update(link)
      .eq('id', id);

    if (error) throw error;
    
    const currentLinks = get().links;
    set({
      links: currentLinks.map((l) =>
        l.id === id ? { ...l, ...link } : l
      ),
    });
  },
  
  deleteLink: async (id) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    const currentLinks = get().links;
    set({ links: currentLinks.filter((l) => l.id !== id) });
  },
  
  reorderLinks: async (links) => {
    const updates = links.map((link) => ({
      id: link.id,
      position: link.position,
    }));

    const { error } = await supabase
      .from('links')
      .upsert(updates);

    if (error) throw error;
    set({ links });
  },
  
  fetchLinks: async () => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('position');

    if (error) throw error;
    set({ links: data });
  },
}));