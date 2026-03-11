import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ToastContainer } from '../ui/ToastContainer';
import { BookOpen, Library, UserCircle, LogOut } from 'lucide-react';

export function Layout() {
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '추천받기', icon: BookOpen },
    { path: '/library', label: '내 서재', icon: Library },
    { path: '/mypage', label: '마이페이지', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 w-full glass-panel border-x-0 border-t-0 rounded-none">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <BookOpen size={18} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">BookFit</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {isAuthenticated && (
              <div className="flex items-center border-l border-white/10 pl-6">
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <Outlet />
      </main>

      <ToastContainer />
    </div>
  );
}
