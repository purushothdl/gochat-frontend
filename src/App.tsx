// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Router';
import { useEffect } from 'react';
import { useAuthStore } from './features/auth/store/auth.store';
import { userService } from './features/user/services/user.service';
import { authService } from './features/auth/services/auth.service';
import { Toaster } from './shared/components/ui/Toaster';
import { LoadingScreen } from './shared/components/ui/LoadingScreen';

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Always try to refresh token on app startup
        const refreshData = await authService.refresh();
        setToken(refreshData.access_token);
        
        // Now get user profile with fresh token
        const profile = await userService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        logout();
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [setUser, setToken, logout, setInitializing]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;