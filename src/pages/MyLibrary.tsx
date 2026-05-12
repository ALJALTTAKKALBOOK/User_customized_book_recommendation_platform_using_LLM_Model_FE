import React, { useState } from 'react';
import { useLibrary } from '../hooks/useBooks';
import { ReviewWrite } from '../features/reviews/ReviewWrite';
import { BookMarked, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

export function MyLibrary() {
  const { data: books, isLoading } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  if (isLoading) return <div className="p-20 text-center text-white/20 animate-pulse">데이터를 불러오는 중...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <BookMarked className="text-indigo-400" size={24} />
          </div>
          내 서재
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book: any, idx: number) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={book.id}
            className="glass-panel rounded-3xl p-6 hover:bg-white/10 transition-all border border-white/10"
          >
            <div className="mb-6">
              <h3 className="font-bold text-lg text-white line-clamp-1">{book.title}</h3>
              <p className="text-xs text-white/40 mt-1">{book.author}</p>
            </div>

            <div className="flex gap-2 mb-6">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-300 rounded-lg">
                {book.sub_category} {/* 장르가 아닌 소분류 표시 */}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 text-white/40 rounded-lg">LV.{book.difficulty}</span>
            </div>

            <button
              onClick={() => setSelectedBook(book)}
              className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Edit3 size={14} /> 기록 남기기 및 레벨업
            </button>
          </motion.div>
        ))}
      </div>

      {selectedBook && (
        <ReviewWrite
          readBookId={selectedBook.id}
          bookTitle={selectedBook.title}
          category={selectedBook.sub_category} // 💡 소분류 전달
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}