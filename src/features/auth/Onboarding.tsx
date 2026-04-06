import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

const ALL_SUB_CATEGORIES = [
  "컴퓨터공학", "IT일반", "OS", "네트워크", "보안/해킹",
  "데이터베이스", "개발방법론", "웹프로그래밍", "프로그래밍 언어", "모바일프로그래밍",
];

const SCORE_GUIDES = [
  { score: 0, label: '0', desc: '전혀 모름 (노베이스)' },
  { score: 3, label: '3', desc: '기초 문법 및 튜토리얼 경험 있음' },
  { score: 5, label: '5', desc: '간단한 토이 프로젝트 구현 가능' },
  { score: 7, label: '7', desc: '실무 적용 및 트러블슈팅 경험 있음' },
  { score: 10, label: '10', desc: '해당 분야의 아키텍처 설계 및 전문가 수준' },
];

export function Onboarding() {
  const { completeOnboarding } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Initialize with 0 for all categories
  const [proficiencies, setProficiencies] = useState<Record<string, number>>(
    ALL_SUB_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSliderChange = (category: string, value: number) => {
    setProficiencies((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const payload = { proficiencies };

      // Send to backend via mapped API method
      await api.users.onboarding(payload);

      // Update local store (converting numbers to strings to match existing type, or just cast as needed)
      // Since completeOnboarding expects Record<string, string>, but we have numbers.
      const stringifiedPayload = Object.entries(proficiencies).reduce((acc, [k, v]) => {
        acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>);

      completeOnboarding(stringifiedPayload);
      addToast('프로파일링이 완료되었습니다! 맞춤형 추천을 확인해보세요.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Failed to submit onboarding data:', error);
      addToast('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 glass-panel rounded-[2rem] mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">초기 기술 숙련도 설정</h2>
        <p className="text-white/60 mb-8">
          정확한 맞춤 추천을 위해 현재 기술 스택별 숙련도를 평가해주세요.
          <br />각 카테고리별로 0점에서 10점 사이로 선택하실 수 있습니다.
        </p>

        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
          <h3 className="text-sm font-semibold text-white/80 mb-4">점수 가이드라인</h3>
          <ul className="space-y-2 text-xs text-white/60">
            {SCORE_GUIDES.map((guide) => (
              <li key={guide.score} className="flex item-center">
                <span className="inline-block w-8 font-bold text-indigo-400">{guide.score}점</span>
                <span>: {guide.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          {ALL_SUB_CATEGORIES.map((category) => (
            <div key={category} className="p-6 rounded-2xl bg-white/5 border border-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-white/90 text-lg">{category}</span>
                <span className="text-indigo-400 font-bold text-xl">{proficiencies[category]}점</span>
              </div>

              <div className="relative pt-1 pb-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={proficiencies[category]}
                  onChange={(e) => handleSliderChange(category, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                {/* Visual markers for important scores */}
                <div className="flex justify-between text-xs text-white/40 mt-2 px-1">
                  <span>0</span>
                  <span>3</span>
                  <span>5</span>
                  <span>7</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex border-t border-white/10 pt-6 justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg transition-all"
          >
            {isSubmitting ? '저장 중...' : '프로파일링 완료하고 시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
