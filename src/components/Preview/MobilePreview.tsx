import { useStore } from '../../store/useStore';
import { Smartphone } from 'lucide-react';

export function MobilePreview() {
  const { profile, links } = useStore();

  return (
    <div className="relative w-[375px] h-[812px] bg-white rounded-[60px] shadow-xl overflow-hidden border-8 border-gray-900">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl" />
      
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="p-8 space-y-6">
          {profile && (
            <div className="text-center space-y-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{profile.full_name}</h2>
                {profile.bio && (
                  <p className="text-gray-600 text-sm mt-2">{profile.bio}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  {link.icon && (
                    <img
                      src={link.icon}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{link.title}</h3>
                    {link.description && (
                      <p className="text-sm text-gray-500">{link.description}</p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}