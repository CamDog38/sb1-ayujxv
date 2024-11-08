import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Theme } from '../../lib/supabase';

const defaultThemes = [
  {
    name: 'Light',
    background_color: '#ffffff',
    text_color: '#1f2937',
    button_style: 'light',
    font_family: 'Inter'
  },
  {
    name: 'Dark',
    background_color: '#1f2937',
    text_color: '#ffffff',
    button_style: 'dark',
    font_family: 'Inter'
  },
  {
    name: 'Gradient',
    background_color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text_color: '#ffffff',
    button_style: 'gradient',
    font_family: 'Poppins'
  }
];

export function ThemeForm() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserTheme();
  }, []);

  const loadUserTheme = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: theme } = await supabase
        .from('themes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = async (theme: typeof defaultThemes[0]) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('themes')
        .upsert({
          user_id: user.id,
          ...theme,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setCurrentTheme({ ...theme, user_id: user.id } as Theme);
      toast.success('Theme applied successfully');
    } catch (error) {
      toast.error('Error applying theme');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-xl font-semibold">Choose Your Theme</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => applyTheme(theme)}
            disabled={loading}
            className={`p-6 rounded-lg border-2 transition-all ${
              currentTheme?.name === theme.name
                ? 'border-indigo-500 shadow-lg'
                : 'border-gray-200 hover:border-indigo-200'
            }`}
            style={{
              background: theme.background_color,
              color: theme.text_color
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
            <div className="space-y-2">
              <div className={`btn ${theme.button_style === 'light' ? 'bg-white text-gray-900' : 
                              theme.button_style === 'dark' ? 'bg-gray-900 text-white' :
                              'bg-white bg-opacity-20 text-white'}`}>
                Sample Button
              </div>
              <p className="text-sm opacity-80">
                {theme.font_family} • {theme.button_style} style
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}