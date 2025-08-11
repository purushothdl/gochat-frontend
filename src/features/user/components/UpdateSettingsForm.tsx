// src/features/user/components/UpdateSettingsForm.tsx
import { useForm } from 'react-hook-form';
import Button from '../../../shared/components/ui/Button';
import type { Profile } from '../types/user.types';

type FormData = {
  notifications_enabled: boolean;
  language: string;
};

interface UpdateSettingsFormProps {
  profile: Profile;
  onSave: (data: Profile) => void;
  onCancel: () => void;
}

export const UpdateSettingsForm = ({ profile, onSave, onCancel }: UpdateSettingsFormProps) => {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { ...profile.settings } });

  const handleFormSubmit = (data: FormData) => {
    onSave({ ...profile, settings: data });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="notifications_enabled"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              {...register('notifications_enabled')}
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="notifications_enabled" className="font-medium text-gray-900">Push Notifications</label>
            <p className="text-gray-500">Receive notifications about your account activity.</p>
          </div>
        </div>
        <div>
            <label htmlFor="language" className="block text-sm font-medium leading-6 text-gray-900">Language</label>
            <select id="language" {...register('language')} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <option value="en">EN (English)</option>
                <option value="es">ES (Español)</option>
                <option value="fr">FR (Français)</option>
            </select>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="button" onClick={onCancel} className="!w-auto bg-red-400 text-white hover:bg-red-500">Cancel</Button>
        <Button type="submit" className="!w-auto hover:bg-gray-800">Save</Button>
      </div>
    </form>
  );
};