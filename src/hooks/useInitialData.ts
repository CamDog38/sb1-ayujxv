import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useInitialData() {
  const { setProfile, setTheme, setLinks } = useStore();

  useEffect(() => {
    async function loadInitialData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setProfile(profile);

          // Load theme
          const { data: theme } = await supabase
            .from('themes')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (theme) {
            setTheme(theme);
          }

          // Load links
          const { data: links } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .order('order', { ascending: true });

          if (links) {
            setLinks(links);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Error loading your data');
      }
    }

    loadInitialData();
  }, [setProfile, setTheme, setLinks]);
}