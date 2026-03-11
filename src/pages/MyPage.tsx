import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Settings, Shield } from 'lucide-react';

export function MyPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-10 tracking-tight">마이페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
            <div className="w-28 h-28 bg-black/40 border border-white/10 text-white rounded-full flex items-center justify-center mb-5 relative z-10 shadow-xl backdrop-blur-md">
              <User size={48} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-white relative z-10 tracking-tight">{user?.name}</h2>
            <p className="text-white/50 mt-1 relative z-10">{user?.email}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Settings size={20} className="text-indigo-400" />
              </div>
              AI 분석 프로필 (도메인 레벨)
            </h3>
            <div className="space-y-3">
              {user?.domain_levels ? (
                Object.entries(user.domain_levels).map(([domain, level]) => (
                  <div key={domain} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                    <span className="font-medium text-white/80">{domain}</span>
                    <span className="px-3.5 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium">
                      {level}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-white/50 p-4 bg-black/20 rounded-xl border border-white/5">설정된 도메인 레벨이 없습니다.</p>
              )}
            </div>
            <p className="text-xs text-white/40 mt-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              독후감을 작성할 때마다 AI가 백그라운드에서 분석하여 프로필을 자동으로 업데이트합니다.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <Shield size={20} className="text-indigo-400" />
              </div>
              계정 설정
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left px-5 py-4 rounded-xl glass-button font-medium">
                비밀번호 변경
              </button>
              <button className="w-full text-left px-5 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors font-medium">
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
