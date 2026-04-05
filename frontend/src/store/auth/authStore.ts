import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      setAccessToken: (token: string) => 
        set({ accessToken: token }),

      logout: () => {
        set({ accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
      
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);