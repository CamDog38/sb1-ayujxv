import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PollOption } from '../../../types/link';

interface PollFieldsProps {
  value: any;
  onChange: (values: any) => void;
}

export function PollFields({ value, onChange }: PollFieldsProps) {
  const [options, setOptions] = useState<PollOption[]>(value.poll_options || []);

  const addOption = () => {
    const newOption: PollOption = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      votes: 0,
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    onChange({ ...value, poll_options: updatedOptions });
  };

  const updateOption = (id: string, text: string) => {
    const updatedOptions = options.map(option =>
      option.id === id ? { ...option, text } : option
    );
    setOptions(updatedOptions);
    onChange({ ...value, poll_options: updatedOptions });
  };

  const removeOption = (id: string) => {
    const updatedOptions = options.filter(option => option.id !== id);
    setOptions(updatedOptions);
    onChange({ ...value, poll_options: updatedOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <input
              type="text"
              value={option.text}
              onChange={(e) => updateOption(option.id, e.target.value)}
              placeholder="Option text"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => removeOption(option.id)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOption}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
      >
        <Plus className="h-5 w-5 inline-block mr-2" />
        Add Option
      </button>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Settings
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="multiple_votes"
                checked={value.multiple_votes}
                onChange={(e) => onChange({ ...value, multiple_votes: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="multiple_votes" className="ml-2 text-sm text-gray-700">
                Allow multiple votes
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_results"
                checked={value.show_results}
                onChange={(e) => onChange({ ...value, show_results: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="show_results" className="ml-2 text-sm text-gray-700">
                Show results before voting
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date (optional)
          </label>
          <input
            type="datetime-local"
            value={value.end_date || ''}
            onChange={(e) => onChange({ ...value, end_date: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </div>
  );
}