import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBolt,
  HiChevronDown,
  HiOutlineUser,
  HiOutlineArrowRightStartOnRectangle,
  HiOutlineWindow
} from 'react-icons/hi2';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title = 'Dashboard General' }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      name: 'Inicio',
      path: '/',
      icon: <HiOutlineHome className="w-5 h-5" />,
      show: true
    },
    {
      name: 'Dashboard',
      path: '/admin/welcome',
      icon: <HiOutlineWindow className="w-5 h-5" />,
      show: true
    },
    {
      name: 'Usuarios',
      path: '/admin/users',
      icon: <HiOutlineUsers className="w-5 h-5" />,
      show: user?.roles?.includes('admin')
    }
  ].filter(item => item.show);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <HiOutlineBolt className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AIFront</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-500 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6">
          <div className="font-medium text-slate-600">
            {title}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200">
                {user?.email?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                {user?.email?.split('@')[0] ?? 'Usuario'}
              </span>
              <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm text-slate-900 font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-slate-500 font-mono truncate mt-0.5">ID: {user?.id}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/admin/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 px-3 py-2 rounded-lg transition-colors text-left mb-1"
                  >
                    <HiOutlineUser className="w-4 h-4" />
                    Mi Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-left"
                  >
                    <HiOutlineArrowRightStartOnRectangle className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
