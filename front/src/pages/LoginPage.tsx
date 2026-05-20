import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineKey,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiChevronRight,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErr, setLocalErr] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/admin/welcome';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    try {
      await login({ email, password });
      // El { replace: true } borra "/login" del historial para que el botón "Atrás" del navegador no lo devuelva al login.
      navigate(from, { replace: true });
    } catch {
      setLocalErr('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500 opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-800 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 mb-2">
              <HiOutlineKey className="w-7 h-7 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bienvenido</h1>
            <p className="text-slate-500 text-sm">Inicia sesión para continuar</p>
          </div>

          {/* Error alert */}
          {localErr && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm">
              <HiOutlineExclamationCircle className="w-5 h-5 shrink-0" />
              {localErr}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineEnvelope className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/20"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión…
                </>
              ) : (
                <>
                  Iniciar sesión
                  <HiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <a href="/" className="text-sm text-brand-600 hover:text-brand-700 block text-center mt-4">Volver</a>
          </form>
        </div>
      </div>
    </div>
  );
}
