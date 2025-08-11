// src/features/user/components/UpdateProfileForm.tsx
import { useForm } from 'react-hook-form';
import type { Profile } from '../../auth/types/auth.types';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';

type FormData = { name: string };

interface UpdateProfileFormProps {
  profile: Profile;
  onSave: (data: Profile) => void;
  onCancel: () => void;
}

export const UpdateProfileForm = ({ profile, onSave, onCancel }: UpdateProfileFormProps) => {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { name: profile.name } });
  
  const handleFormSubmit = (data: FormData) => {
    // This form will call the onSave prop passed by the parent page
    // The parent page will handle the API call and state update
    onSave({ ...profile, ...data });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register('name', { required: true })} />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="button" onClick={onCancel} className="!w-auto bg-transparent text-gray-700 hover:bg-gray-100">Cancel</Button>
        <Button type="submit" className="!w-auto">Save</Button>
      </div>
    </form>
  );
};