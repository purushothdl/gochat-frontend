// src/features/user/components/ChangePasswordForm.tsx
import { useForm } from 'react-hook-form';
import { userService } from '../services/user.service';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import Label from '../../../shared/components/ui/Label';
import { useState } from 'react';

type FormData = {
    current_password: '';
    new_password: '';
};

export const ChangePasswordForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        setApiError(null);
        setSuccessMessage(null);
        try {
            await userService.changePassword(data);
            setSuccessMessage("Password changed successfully!");
            reset();
        } catch (error: any) {
            setApiError(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" {...register('current_password', { required: true })} />
            </div>
             <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" {...register('new_password', { required: true, minLength: 8 })} />
                {errors.new_password && <p className="text-xs text-red-600 mt-1">Password must be at least 8 characters.</p>}
            </div>
            {apiError && <p className="text-sm text-red-600">{apiError}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            <div className="pt-2">
                <Button type="submit" className="!w-auto">Change Password</Button>
            </div>
        </form>
    )
}