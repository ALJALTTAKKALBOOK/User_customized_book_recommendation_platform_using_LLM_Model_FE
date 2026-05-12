import React, { useState } from 'react';
import { useUpdateReview } from '../../hooks/useBooks';
import { Sparkles, X, Star, MessageSquare } from 'lucide-react';

interface ReviewWriteProps {
  readBookId: number;
  bookTitle: string;
  category: string;
  onClose: () => void;
}

export function ReviewWrite({ readBookId, bookTitle, category, onClose }: ReviewWriteProps) {
  const [feeling, setFeeling] = useState('읽을만 했다');
  const [learned, setLearned] = useState('');
  const [hard, setHard] = useState('');

  const updateReview = useUpdateReview();

  const difficultyOptions = ["너무 쉬웠다", "쉬웠다", "읽을만 했다", "이해가 잘 안된다", "무슨의미인지 아예모르겠다"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateReview.mutate({
      readBookId,
      data: {
        category: category || "IT", //  카테고리가 없으면 기본값이라도 보냄
        feeling_difficulty: feeling,
        learned_content: learned.trim() || "", //  null이 아닌 빈 문자열이라도 보냄
        hard_content: hard.trim() || ""
      }
    }, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel rounded-[2.5rem] p-8 w-full max-w-xl relative border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Growth Record</span>
          </div>
          <h3 className="text-2xl font-bold text-white">『{bookTitle}』</h3>
          <p className="text-xs text-white/30 mt-1">분야: {category}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <Star size={14} className="text-yellow-400" /> 이 책의 체감 난이도는?
            </label>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFeeling(option)}
                  className={`py-2 px-3 rounded-xl text-[11px] border transition-all ${feeling === option ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <MessageSquare size={14} /> 새롭게 배운 내용/어려웠던 점
            </label>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="자유롭게 적어주세요. AI가 분석하여 역량에 반영합니다."
              className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:outline-none text-white text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={updateReview.isPending}
            className="w-full py-4 rounded-2xl font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl transition-all disabled:opacity-50"
          >
            {updateReview.isPending ? 'AI 역량 분석 중...' : '저장 및 레벨업 반영'}
          </button>
        </form>
      </div>
    </div>
  );
}