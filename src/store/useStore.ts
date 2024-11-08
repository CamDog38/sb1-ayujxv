import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Link } from '../types/link';

interface Store {
  links: Link[];
  setLinks: (links: Link[]) => void;
  addLink: (link: Link) => void;
  updateLink: (link: Link) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: Link[]) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

export const useStore = create<Store>((set) => ({
  links: [],
  
  setLinks: (links) => set({ links }),
  
  addLink: (link) => set((state) => ({
    links: [...state.links, link].sort((a, b) => a.position - b.position)
  })),
  
  updateLink: (link) => set((state) => ({
    links: state.links.map((l) => l.id === link.id ? link : l)
      .sort((a, b) => a.position - b.position)
  })),
  
  removeLink: (id) => set((state) => ({
    links: state.links.filter((l) => l.id !== id)
  })),
  
  reorderLinks: async (links) => {
    try {
      const updates = links.map((link, index) => ({
        id: link.id,
        position: index,
      }));

      const { error } = await supabase.rpc('update_link_positions', {
        link_positions: updates
      });

      if (error) throw error;
      set({ links });
    } catch (error) {
      console.error('Error updating link positions:', error);
      throw error;
    }
  },
  
  fetchLinks: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;
      set({ links: data || [] });
    } catch (error) {
      console.error('Error fetching links:', error);
      throw error;
    }
  },
}));