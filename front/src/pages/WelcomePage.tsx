import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/MainLayout';

export function WelcomePage() {
  const { user } = useAuth();

  return (
    <MainLayout title="Dashboard General">
      <div className="space-y-8">
        {/* Saludo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              ¡Hola, {user?.email?.split('@')[0] ?? 'bienvenido'}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Aquí tienes el resumen de tu cuenta y estado del sistema.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Sesión activa
          </div>
        </div>

        {/* Tarjetas de Información */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Tarjeta: Email */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm font-medium">Correo Electrónico</span>
            </div>
            <p className="text-white font-semibold text-lg truncate">{user?.email ?? '—'}</p>
          </div>

          {/* Tarjeta: Roles */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm font-medium">Roles</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {user?.roles?.map((role) => (
                <li key={role} className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 font-mono border border-slate-700">
                  {role}
                </li>
              ))}
            </ul>
          </div>

          {/* Tarjeta: Token JWT */}
          <div className="sm:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-slate-400 text-sm font-medium block">Token de Autorización (JWT)</span>
              </div>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-xs text-slate-500 break-all border border-slate-800/80">
              {user ? localStorage.getItem('aifront_token') ?? '' : '—'}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
