import { ProfileForm } from '../Profile/ProfileForm';

export function BioTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile & Bio</h1>
      <ProfileForm />
    </div>
  );
}