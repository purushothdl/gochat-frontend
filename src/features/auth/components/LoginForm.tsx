// src/features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, access_token } = await authService.login(data);
      setUser(user, access_token);
      navigate('/profile');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password', { required: true })} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isLoading={isLoading}>
        Sign in
      </Button>
    </form>
  );
};