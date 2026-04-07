import { useState, useRef, useEffect } from 'react';
import { Send, User, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
// import { api } from '../../api/client'; // 필요 시 주석 해제
import { useToastStore } from '../../store/useToastStore';

// 🚨 백엔드에서 넘겨주는 JSON 규격
interface Book {
  book_id: number;
  title: string;
  author: string;
  difficulty: number;
  summary: string;
  cover_url?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  books?: Book[];
  isStreaming?: boolean;
}

export function RecommendationChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 어떤 책을 찾으시나요? 관심 있는 분야나 현재 상황을 말씀해주시면 딱 맞는 책을 추천해 드릴게요.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true }]);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/recommendations/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: userMsg.content }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Stream not supported');
      const decoder = new TextDecoder();
      let buffer = '';

      const processEventBlock = (block: string) => {
        const eventMatch = block.match(/^event:\s*(.+)$/m);
        const eventType = eventMatch ? eventMatch[1] : 'message';

        const dataLines = block
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.replace(/^data:\s?/, ''));

        const data = dataLines.join('\n');
        if (!data) return;

        if (eventType === 'books') {
          try {
            const books = JSON.parse(data);
            setMessages((prev) =>
              prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, books } : msg))
            );
          } catch (err) {
            console.error('Failed to parse books event', err);
          }
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: (msg.content || '') + data }
                : msg
            )
          );
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const raw = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          processEventBlock(raw);
        }
      }

      if (buffer.trim()) processEventBlock(buffer.trim());

      setMessages((prev) => prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg)));
    } catch (error) {
      console.error(error);
      addToast('추천을 가져오는 중 오류가 발생했습니다.', 'error');
      setMessages((prev) => prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, isStreaming: false, content: '서버와 연결을 실패했습니다.' } : msg)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-panel rounded-[2rem] overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>

            {/* 프로필 아이콘 */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
              : 'bg-white/10 border border-white/20 text-indigo-300 backdrop-blur-md'
              }`}>
              {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
            </div>

            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-3 w-full`}>

              {/* 🌟 1. 책 카드 */}
              {msg.books && msg.books.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-2">
                  {msg.books.map((book, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      key={book.book_id || idx}
                      className="glass-panel p-4 rounded-2xl flex flex-col group hover:bg-white/10 transition-colors border border-white/10 overflow-hidden"
                    >
                      {/* 🖼️ 책 표지 이미지 추가된 부분 */}
                      <div className="mb-4 w-full h-40 rounded-xl overflow-hidden bg-black/20 flex items-center justify-center relative border border-white/5">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            onError={(e) => {
                              // 이미지 로드 실패 시 기본 이미지로 대체
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/2a2a35/a5a5b4?text=No+Cover';
                            }}
                          />
                        ) : (
                          <BookOpen size={32} className="text-white/20" />
                        )}

                        {/* 난이도 뱃지 (이미지 우측 하단에 둥둥 띄우기) */}
                        <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold rounded-lg">
                          난이도 {book.difficulty}/10
                        </div>
                      </div>

                      {/* 책 정보 제목/저자 */}
                      <div className="mb-3">
                        <h4 className="font-bold text-white text-[15px] line-clamp-2 leading-snug tracking-tight">{book.title}</h4>
                        <p className="text-xs text-white/50 mt-1.5 line-clamp-1">{book.author}</p>
                      </div>

                      {/* 줄거리 */}
                      <div className="bg-black/20 border border-white/5 p-3 rounded-xl flex-1">
                        <p className="text-[13px] text-white/70 leading-relaxed line-clamp-4">{book.summary}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* 🌟 2. AI 답변 텍스트 */}
              {(msg.content || msg.isStreaming || msg.role === 'user') && (
                <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md ${msg.role === 'user'
                  ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm self-end'
                  : 'bg-transparent text-white/90 self-start'
                  }`}>
                  <p className="whitespace-pre-wrap leading-7">{msg.content}</p>
                  {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse" />}
                </div>
              )}

            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-black/40 border-t border-white/10 backdrop-blur-xl relative z-10">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="나 주말에 읽을 자바 책 추천해 줘..."
            className="w-full pl-5 pr-14 py-4 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 rounded-2xl text-[15px]"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[11px] text-center text-white/40 mt-3 tracking-wide">
          Agentic RAG가 유저 프로필과 도서 DB를 분석하여 최적의 책을 추천합니다.
        </p>
      </div>
    </div>
  );
}