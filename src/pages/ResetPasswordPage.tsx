// src/pages/ResetPasswordPage.tsx
import { ResetPasswordForm } from '../features/auth/components/ResetPasswordForm';
import Card from '../shared/components/ui/Card';

const ResetPasswordPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Choose a new password</h2>
      <div className="mt-8">
        <Card>
          <ResetPasswordForm />
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;