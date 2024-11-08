import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '../../../types/link';

interface ContactFieldsProps {
  value: any;
  onChange: (values: any) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];

export function ContactFields({ value, onChange }: ContactFieldsProps) {
  const [fields, setFields] = useState<FormField[]>(value.form_fields || []);

  const addField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      label: '',
      type: 'text',
      required: false,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onChange({ ...value, form_fields: updatedFields });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    const updatedFields = fields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onChange({ ...value, form_fields: updatedFields });
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id);
    setFields(updatedFields);
    onChange({ ...value, form_fields: updatedFields });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  placeholder="Field Label"
                  className="input"
                />
                
                <div className="flex space-x-4">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FormField['type'] })}
                    className="input"
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`required-${field.id}`} className="ml-2 text-sm text-gray-700">
                      Required
                    </label>
                  </div>
                </div>

                {field.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (one per line)
                    </label>
                    <textarea
                      value={field.options?.join('\n')}
                      onChange={(e) => updateField(field.id, {
                        options: e.target.value.split('\n').filter(Boolean)
                      })}
                      className="input"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="ml-4 p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addField}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
      >
        <Plus className="h-5 w-5 inline-block mr-2" />
        Add Field
      </button>
    </div>
  );
}