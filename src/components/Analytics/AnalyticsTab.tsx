import { BarChart2, Users, MousePointer2, Clock } from 'lucide-react';

export function AnalyticsTab() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold mt-1">1,234</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">↑ 12%</span>
              <span className="text-gray-500 text-sm ml-2">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
              <p className="text-2xl font-semibold mt-1">32%</p>
            </div>
            <MousePointer2 className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-red-500 text-sm">↓ 3%</span>
              <span className="text-gray-500 text-sm ml-2">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Time</p>
              <p className="text-2xl font-semibold mt-1">2:30</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">↑ 8%</span>
              <span className="text-gray-500 text-sm ml-2">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Link</p>
              <p className="text-2xl font-semibold mt-1">Instagram</p>
            </div>
            <BarChart2 className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-green-500 text-sm">456</span>
              <span className="text-gray-500 text-sm ml-2">clicks this week</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Popular Links</h2>
          <div className="space-y-4">
            {['Instagram', 'Twitter', 'YouTube', 'Blog'].map((link) => (
              <div key={link} className="flex items-center justify-between">
                <span className="text-gray-600">{link}</span>
                <span className="text-gray-900 font-medium">
                  {Math.floor(Math.random() * 500)} clicks
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {['Direct', 'Social', 'Search', 'Referral'].map((source) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-gray-600">{source}</span>
                <span className="text-gray-900 font-medium">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}