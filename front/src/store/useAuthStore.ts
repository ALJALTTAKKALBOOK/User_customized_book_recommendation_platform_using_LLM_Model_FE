import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  domain_levels?: Record<string, string>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (user: User) => void;
  logout: () => void;
  completeOnboarding: (domainLevels: Record<string, string>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  login: (user) => set({ user, isAuthenticated: true, isOnboarded: !!user.domain_levels }),
  logout: () => set({ user: null, isAuthenticated: false, isOnboarded: false }),
  completeOnboarding: (domainLevels) => set((state) => ({
    user: state.user ? { ...state.user, domain_levels: domainLevels } : null,
    isOnboarded: true,
  })),
}));
