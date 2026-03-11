import React, { useState } from 'react';
import { useLibrary } from '../hooks/useBooks';
import { ReviewWrite } from '../features/reviews/ReviewWrite';
import { BookMarked, Edit3 } from 'lucide-react';

export function MyLibrary() {
  const { data: books, isLoading } = useLibrary();
  const [selectedBook, setSelectedBook] = useState<{id: string, title: string} | null>(null);

  if (isLoading) return <div className="p-8 text-center text-white/50">로딩 중...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-10 flex items-center gap-3 tracking-tight">
        <div className="p-2.5 bg-white/10 rounded-xl border border-white/10">
          <BookMarked className="text-indigo-400" size={24} />
        </div>
        내 서재
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => (
          <div key={book.id} className="glass-panel rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-bold text-xl text-white line-clamp-1 tracking-tight">{book.title}</h3>
                <p className="text-sm text-white/50 mt-1.5">{book.author}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mb-8">
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 rounded-lg">{book.genre}</span>
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 rounded-lg">{book.difficulty}</span>
            </div>

            <button
              onClick={() => setSelectedBook({ id: book.id, title: book.title })}
              className="w-full py-3 flex items-center justify-center gap-2 glass-button rounded-xl font-medium group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-all"
            >
              <Edit3 size={16} />
              독후감 쓰기
            </button>
          </div>
        ))}
      </div>

      {selectedBook && (
        <ReviewWrite 
          bookId={selectedBook.id} 
          bookTitle={selectedBook.title} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}
