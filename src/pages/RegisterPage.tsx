// src/pages/RegisterPage.tsx
import { Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import Card from '../shared/components/ui/Card';

const RegisterPage = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          sign in to your existing account
        </Link>
      </p>
      <div className="mt-8">
        <Card>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;