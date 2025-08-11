// src/pages/LoginPage.tsx
import { Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import Card from '../shared/components/ui/Card';

const LoginPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          create a new account
        </Link>
      </p>
      <div className="mt-8">
        <Card>
          <LoginForm />
        </Card>
        <p className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;