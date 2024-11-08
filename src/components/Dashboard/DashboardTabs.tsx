import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, User, Palette, BarChart2, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { name: 'Links', icon: LinkIcon, path: '/dashboard/links' },
  { name: 'Bio', icon: User, path: '/dashboard/bio' },
  { name: 'Style', icon: Palette, path: '/dashboard/style' },
  { name: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' }
];

export function DashboardTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabChange = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="bg-white shadow-sm mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <button
                key={tab.name}
                onClick={() => handleTabChange(tab.path)}
                className={cn(
                  'group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm',
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon
                  className={cn(
                    'mr-2 h-5 w-5',
                    isActive
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}