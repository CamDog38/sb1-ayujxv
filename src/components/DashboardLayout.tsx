import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Layout, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { DashboardTabs } from './Dashboard/DashboardTabs';
import { DashboardRoutes } from './Dashboard/DashboardRoutes';
import { MobilePreview } from './Preview/MobilePreview';
import { SettingsModal } from './Settings/SettingsModal';
import { useState, useEffect } from 'react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { profile, fetchLinks } = useStore();

  useEffect(() => {
    if (fetchLinks) {
      fetchLinks();
    }
  }, [fetchLinks]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center px-2 text-gray-900">
                <Layout className="h-6 w-6" />
                <span className="ml-2 font-semibold">LinkHub</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-[375px] flex-shrink-0">
            <div className="sticky top-8">
              <MobilePreview />
            </div>
          </div>
          
          <div className="flex-1">
            <DashboardTabs />
            <DashboardRoutes />
          </div>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}