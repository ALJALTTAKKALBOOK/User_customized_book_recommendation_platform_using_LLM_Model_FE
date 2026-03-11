import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Auth } from './pages/Auth';
import { Onboarding } from './features/auth/Onboarding';
import { RecommendationChat } from './features/chat/RecommendationChat';
import { MyLibrary } from './pages/MyLibrary';
import { MyPage } from './pages/MyPage';
import { useAuthStore } from './store/useAuthStore';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  
  return <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/auth" element={<Auth />} />
            
            <Route 
              path="/onboarding" 
              element={
                <RequireAuth>
                  <Onboarding />
                </RequireAuth>
              } 
            />

            <Route path="/" element={<ProtectedRoute><RecommendationChat /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
