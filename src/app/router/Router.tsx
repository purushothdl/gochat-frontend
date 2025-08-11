// src/app/router/Router.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store';

import HomePage from '../../pages/HomePage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';
import ProfilePage from '../../pages/ProfilePage';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import ResetPasswordPage from '../../pages/ResetPasswordPage';

// Layout component to provide consistent structure
const AppLayout = () => {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

// Component to protect routes
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Component to redirect logged-in users away from auth pages
const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/profile" replace />;
};

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      // Public-only routes (login, register)
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [{ path: '/profile', element: <ProfilePage /> }],
      },
    ],
  },
]);