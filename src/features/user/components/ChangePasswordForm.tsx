// src/features/user/components/ChangePasswordForm.tsx
import { useForm } from 'react-hook-form';
import { userService } from '../services/user.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';
import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../../shared/types/api.types';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; 

type FormData = {
  current_password: '';
  new_password: '';
};

export const ChangePasswordForm = () => {
  // Destructure setError from useForm
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<FormData>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false); 
  
  const onSubmit = async (data: FormData) => {
    setApiError(null);
    setSuccessMessage(null);
    reset(data, { keepErrors: false }); 

    try {
      await userService.changePassword(data);
      setSuccessMessage('Password changed successfully!');
      reset({ current_password: '', new_password: '' }); 
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        const errorResponse = err.response.data as ApiErrorResponse;

        if (errorResponse.error.code === 'VALIDATION_ERROR' && errorResponse.data) {
          // Handle field-specific validation errors from the API
          Object.entries(errorResponse.data).forEach(([field, message]) => {
            setError(field as keyof FormData, {
              type: 'server',
              message: message,
            });
          });
        } else {
          // Handle other API errors (e.g., "Current password is incorrect")
          setApiError(errorResponse.error.message);
        }
      } else {
        // Fallback for network errors or unexpected issues
        setApiError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="current_password">Current Password</Label>
        <div className="relative">
          <Input
            id="current_password"
            type={showCurrentPassword ? 'text' : 'password'}
            {...register('current_password', { required: 'This field is required' })}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {/* Display server or client error for this field */}
        {errors.current_password && <p className="text-xs text-red-600 mt-1">{errors.current_password.message}</p>}
      </div>
      <div>
        <Label htmlFor="new_password">New Password</Label>
        <div className="relative">
          <Input
            id="new_password"
            type={showNewPassword ? 'text' : 'password'}
            {...register('new_password', { required: 'This field is required' })}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {/* Display server or client error for this field */}
        {errors.new_password && <p className="text-xs text-red-600 mt-1">{errors.new_password.message}</p>}
      </div>

      {/* Display general, non-field-specific API errors here */}
      {apiError && <p className="text-sm text-red-600">{apiError}</p>}
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

      <div className="pt-2">
        <Button type="submit" className="!w-auto">Change Password</Button>
      </div>
    </form>
  );
};