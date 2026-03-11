import { useState, useRef, useEffect } from 'react';
import { Send, User, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Book {
  title: string;
  genre: string;
  difficulty: string;
  reason: string;
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

    const mockResponseText = "분석 결과, 회원님은 IT/자바 분야의 '초급' 수준이시며, 최근 기초 문법에 어려움을 느끼셨군요. 이를 바탕으로 주말에 가볍게 읽으면서도 기초를 탄탄히 다질 수 있는 책들을 추천해 드립니다.";
    
    let currentText = '';
    
    for (let i = 0; i < mockResponseText.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      currentText += mockResponseText[i];
      setMessages((prev) => 
        prev.map(msg => msg.id === assistantMsgId ? { ...msg, content: currentText } : msg)
      );
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const recommendedBooks: Book[] = [
      {
        title: "혼자 공부하는 자바",
        genre: "IT/프로그래밍",
        difficulty: "입문~초급",
        reason: "기초 문법이 어렵다고 하셨죠? 이 책은 비전공자도 이해할 수 있도록 그림과 함께 아주 쉽게 설명되어 있어 주말에 가볍게 읽기 좋습니다."
      },
      {
        title: "Do it! 자바 프로그래밍 입문",
        genre: "IT/프로그래밍",
        difficulty: "초급",
        reason: "실습 위주로 구성되어 있어 눈으로만 읽는 것보다 직접 쳐보며 기초를 익히기에 완벽한 책입니다."
      }
    ];

    setMessages((prev) => 
      prev.map(msg => msg.id === assistantMsgId ? { ...msg, isStreaming: false, books: recommendedBooks } : msg)
    );
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-panel rounded-[2rem] overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' 
                : 'bg-white/10 border border-white/20 text-indigo-300 backdrop-blur-md'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
            </div>
            
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-3`}>
              <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md ${
                msg.role === 'user' 
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
