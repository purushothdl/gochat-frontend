// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Router';
import { useEffect } from 'react';
import { useAuthStore } from './features/auth/store/auth.store';
import { authService } from './features/auth/services/auth.service';

function App() {
  // Select the functions from the store. These are stable and won't change.
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // This useEffect should only run ONCE when the component mounts.
  useEffect(() => {
    const validateToken = async () => {
      // Inside an effect that runs only once, it's safe to get the state like this.
      const token = useAuthStore.getState().token;

      if (token) {
        try {
          const user = await authService.getMe();
          setUser(user, token);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
    };

    validateToken();
  }, [setUser, logout]); 

  return <RouterProvider router={router} />;
}

export default App;