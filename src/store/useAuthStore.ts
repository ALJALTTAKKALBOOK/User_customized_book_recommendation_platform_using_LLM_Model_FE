import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  domain_levels?: Record<string, number | string>; // 레벨은 숫자일 수 있으므로 타입을 유연하게 변경
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (user: User) => void;
  logout: () => void;
  //  추가: 서버에서 받은 최신 데이터로 유저 정보만 덮어씌우는 함수
  updateUser: (userData: User) => void;
  completeOnboarding: (domainLevels: Record<string, string | number>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,

  login: (user) => set({
    user,
    isAuthenticated: true,
    isOnboarded: !!user.domain_levels && Object.keys(user.domain_levels).length > 0
  }),

  logout: () => {
    localStorage.removeItem('token'); // 로그아웃 시 토큰도 삭제
    set({ user: null, isAuthenticated: false, isOnboarded: false });
  },

  //  구현: 기존 상태를 유지하면서 유저 정보만 업데이트
  updateUser: (userData) => set((state) => ({
    user: userData,
    isOnboarded: !!userData.domain_levels
  })),

  completeOnboarding: (domainLevels) => set((state) => ({
    user: state.user ? { ...state.user, domain_levels: domainLevels } : null,
    isOnboarded: true,
  })),
}));