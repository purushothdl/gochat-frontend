// src/features/auth/components/ForgotPasswordForm.tsx
import { useForm } from 'react-hook-form';
import { authService } from '../services/auth.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';

type FormData = { email: string };

export const ForgotPasswordForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setMessage('');
    try {
      await authService.forgotPassword(data);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      // Intentionally show a generic message for security
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}

      <Button type="submit" isLoading={isLoading}>
        Send Reset Link
      </Button>
    </form>
  );
};