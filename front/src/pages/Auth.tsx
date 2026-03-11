import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'user_1',
      name: '테스트 유저',
      email: 'test@example.com',
    });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 glass-panel rounded-[2rem] relative overflow-hidden">
        {/* Subtle glow effect inside the card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? '다시 오셨군요!' : '환영합니다!'}
          </h1>
          <p className="text-white/60 mt-3 text-center text-sm">
            Agentic RAG 기반 개인 맞춤형 도서 추천 서비스<br/>
            <span className="text-indigo-400 font-medium">BookFit</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">이름</label>
              <input type="text" className="w-full px-4 py-3.5 rounded-xl glass-input" placeholder="홍길동" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">이메일</label>
            <input type="email" className="w-full px-4 py-3.5 rounded-xl glass-input" placeholder="name@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">비밀번호</label>
            <input type="password" className="w-full px-4 py-3.5 rounded-xl glass-input" placeholder="••••••••" required />
          </div>

          <button type="submit" className="w-full py-3.5 mt-8 glass-button-primary rounded-xl font-medium text-lg">
            {isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
            <span className="text-indigo-400 font-medium hover:underline">
              {isLogin ? '회원가입' : '로그인'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
