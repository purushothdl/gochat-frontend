// src/features/auth/components/ResetPasswordForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';

type FormData = { password: string };

export const ResetPasswordForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError('No reset token found. Please request a new link.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Invalid or expired token. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">Password Reset Successful</h2>
        <p className="mt-2 text-sm text-gray-600">You can now log in with your new password. Redirecting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input id="password" type="password" {...register('password', { required: true, minLength: 8 })} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!token && <p className="text-sm text-red-600">Missing password reset token in URL.</p>}

      <Button type="submit" isLoading={isLoading} disabled={!token}>
        Reset Password
      </Button>
    </form>
  );
};