// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Router';
import { useEffect } from 'react';
import { useAuthStore } from './features/auth/store/auth.store';
import { userService } from './features/user/services/user.service';
import { Toaster } from './shared/components/ui/Toaster';
import { LoadingScreen } from './shared/components/ui/LoadingScreen';

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    const hydrateProfile = async () => {
      const token = useAuthStore.getState().token;
      try {
        if (token) {
          const profile = await userService.getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error("Profile hydration failed:", error);
        logout();
      } finally {
        setInitializing(false);
      }
    };

    hydrateProfile();
  }, [setUser, logout, setInitializing]);

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