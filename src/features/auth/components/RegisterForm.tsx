// src/features/auth/components/RegisterForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { userService } from '../../user/services/user.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Register to get the token.
      const { access_token } = await authService.register(data);
      setToken(access_token);

      // Step 2: Fetch the new user's full profile.
      const profile = await userService.getProfile();
      setUser(profile);

      // Step 3: Navigate.
      navigate('/profile');
    } catch (err) {
      setError('Registration failed. The email might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...register('name', { required: true })} />
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" {...register('email', { required: true })} />
      </div>
      <div className="relative">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { required: true })}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" isLoading={isLoading}>
        Create account
      </Button>
    </form>
  );
};