// src/pages/ForgotPasswordPage.tsx
import { ForgotPasswordForm } from '../features/auth/components/ForgotPasswordForm';
import Card from '../shared/components/ui/Card';

const ForgotPasswordPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Enter your email and we'll send you a link to get back into your account.
      </p>
      <div className="mt-8">
        <Card>
          <ForgotPasswordForm />
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;