import { ThemeForm } from '../Theme/ThemeForm';

export function StyleTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Customize Your Style</h1>
      <ThemeForm />
    </div>
  );
}