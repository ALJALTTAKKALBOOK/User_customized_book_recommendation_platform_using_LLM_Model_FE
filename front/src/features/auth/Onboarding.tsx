import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useNavigate } from 'react-router-dom';

const GENRES = ['IT/프로그래밍', '문학', '자기계발', '경제/경영', '역사'];
const LEVELS = ['입문', '초급', '중급', '고급'];

export function Onboarding() {
  const { completeOnboarding } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (genre: string, level: string) => {
    setSelections((prev) => ({ ...prev, [genre]: level }));
  };

  const handleSubmit = () => {
    if (Object.keys(selections).length === 0) {
      addToast('최소 하나의 관심 분야와 난이도를 선택해주세요.', 'error');
      return;
    }
    completeOnboarding(selections);
    addToast('맞춤형 도서 추천을 위한 준비가 완료되었습니다!', 'success');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-8 glass-panel rounded-[2rem] mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">관심 분야 설정</h2>
        <p className="text-white/60 mb-10">
          정확한 맞춤 추천을 위해 관심 있는 분야와 현재 수준을 알려주세요.
        </p>

        <div className="space-y-4">
          {GENRES.map((genre) => (
            <div key={genre} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <span className="font-medium text-white/90 mb-4 sm:mb-0">{genre}</span>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => {
                  const isSelected = selections[genre] === level;
                  return (
                    <button
                      key={level}
                      onClick={() => handleSelect(genre, level)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400/50'
                          : 'glass-button'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3.5 glass-button-primary rounded-xl font-medium text-lg"
          >
            설정 완료하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
