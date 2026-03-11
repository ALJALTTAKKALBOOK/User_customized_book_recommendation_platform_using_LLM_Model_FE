import React, { useState } from 'react';
import { useAddReview } from '../../hooks/useBooks';
import { useToastStore } from '../../store/useToastStore';

export function ReviewWrite({ bookId, bookTitle, onClose }: { bookId: string, bookTitle: string, onClose: () => void }) {
  const [content, setContent] = useState('');
  const addReview = useAddReview();
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addToast('저장되었습니다! AI가 리뷰를 분석하여 프로필을 업데이트합니다.', 'success');
    onClose();

    addReview.mutate({ bookId, content });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-panel rounded-[2rem] p-8 w-full max-w-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">독후감 작성</h3>
          <p className="text-sm text-white/60 mb-6">
            『<span className="text-indigo-300 font-medium">{bookTitle}</span>』에 대한 감상을 자유롭게 적어주세요.
          </p>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 자바 책 읽었는데 기초 문법이 너무 어려웠어..."
              className="w-full h-40 p-5 rounded-2xl glass-input resize-none text-[15px] leading-relaxed"
              required
            />
            
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-medium glass-button"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-medium glass-button-primary"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
