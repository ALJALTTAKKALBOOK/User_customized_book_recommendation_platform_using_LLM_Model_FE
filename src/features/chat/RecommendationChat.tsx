import { useState, useRef, useEffect } from 'react';
import { Send, User, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../api/client';
import { useToastStore } from '../../store/useToastStore';

interface Book {
  title: string;
  genre?: string;
  difficulty?: string;
  reason?: string;
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
      // Use fetch to POST and stream SSE events from the backend
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

      // Helper to process a single SSE event block
      // 💡 [교체할 부분] Helper to process a single SSE event block
      const processEventBlock = (block: string) => {
        // 1. event: 타입 추출 (없으면 기본값 'message')
        const eventMatch = block.match(/^event:\s*(.+)$/m);
        const eventType = eventMatch ? eventMatch[1] : 'message';

        // 2. data: 추출 (여러 줄의 data: 로 들어와도 완벽하게 하나로 합침)
        const dataLines = block
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.replace(/^data:\s?/, '')); // 딱 공백 한 칸(선택)만 제거!

        const data = dataLines.join('\n');

        if (!data) return; // 빈 데이터는 무시

        // 3. 타입에 따른 상태 업데이트
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
          // 일반 텍스트 (스트리밍)
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

        // Process all complete SSE event blocks separated by \n\n
        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const raw = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          processEventBlock(raw);
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) processEventBlock(buffer.trim());

      // mark streaming finished
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

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
              : 'bg-white/10 border border-white/20 text-indigo-300 backdrop-blur-md'
              }`}>
              {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
            </div>

            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
              <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md ${msg.role === 'user'
                ? 'bg-white/10 border border-white/10 text-white rounded-tr-sm'
                : 'bg-transparent text-white/90'
                }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse" />}
              </div>

              {msg.books && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 w-full">
                  {msg.books.map((book, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      key={idx}
                      className="glass-panel p-5 rounded-2xl flex flex-col group hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-white/5 rounded-xl text-indigo-400 border border-white/10 group-hover:scale-110 transition-transform">
                          <BookOpen size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg line-clamp-1 tracking-tight">{book.title}</h4>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 rounded-lg">{book.genre}</span>
                            <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/70 rounded-lg">{book.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/20 border border-white/5 p-4 rounded-xl flex-1">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">추천 이유</span>
                        <p className="text-sm text-white/70 leading-relaxed">{book.reason}</p>
                      </div>
                    </motion.div>
                  ))}
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
            className="w-full pl-5 pr-14 py-4 glass-input rounded-2xl text-[15px]"
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
