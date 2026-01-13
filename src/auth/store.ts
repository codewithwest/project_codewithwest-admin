import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | null;
  email: string | null;
  login: (data: { token: string; id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null as string | null,
      userId: null as string | null,
      email: null as string | null,
      login: (data) => set({
        isLoggedIn: true,
        token: data.token,
        userId: data.id,
        email: data.email,
      }),
      logout: () => set({
        isLoggedIn: false,
        token: null,
        userId: null,
        email: null,
      }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
