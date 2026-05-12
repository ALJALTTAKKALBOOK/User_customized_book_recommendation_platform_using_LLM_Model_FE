import React, { useEffect } from 'react';
import { useUserProfile } from '../hooks/useBooks';
import { User, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function MyPage() {
  const { data: userProfile, isLoading, refetch } = useUserProfile();

  useEffect(() => {
    refetch(); // 페이지 진입 시 최신화
  }, [refetch]);

  if (isLoading) return <div className="p-20 text-center text-white/20 animate-pulse">데이터 분석 리포트 생성 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 왼쪽: 프로필 */}
        <div className="glass-panel p-8 rounded-[2rem] flex flex-col items-center text-center border border-white/10">
          <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 border border-indigo-500/30">
            <User size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">{userProfile?.nickname || userProfile?.name}</h2>
          <p className="text-white/30 text-sm">{userProfile?.email}</p>
        </div>

        {/* 오른쪽: 소분류별 역량 분석 */}
        <div className="md:col-span-2 glass-panel p-8 rounded-[2rem] border border-white/10">
          <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
            <Zap className="text-yellow-400" size={18} /> 실시간 AI 역량 분석 리포트
          </h3>

          <div className="space-y-6">
            {userProfile?.domain_levels && Object.entries(userProfile.domain_levels)
              .filter(([domain]) => domain !== "IT") //  "IT" 대분류는 리스트에서 제외
              .map(([domain, level]) => (
                <div key={domain} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70 font-medium">{domain}</span>
                    <span className="text-indigo-400 font-bold">LV.{level}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(Number(level) / 10) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}