import { useAuth } from '../../context/AuthContext';
import { MainLayout } from '../../components/MainLayout';
import {
  HiOutlineEnvelope,
  HiOutlineBriefcase,
  HiOutlineShieldCheck
} from 'react-icons/hi2';

export function WelcomePage() {
  const { user } = useAuth();

  return (
    <MainLayout title="Dashboard General">
      <div className="space-y-8">
        {/* Saludo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              ¡Hola, {user?.email?.split('@')[0] ?? 'bienvenido'}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Aquí tienes el resumen de tu cuenta y estado del sistema.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-brand-600 text-sm font-medium self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sesión activa
          </div>
        </div>

        {/* Tarjetas de Información */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Tarjeta: Email */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                <HiOutlineEnvelope className="w-5 h-5 text-brand-600" />
              </div>
              <span className="text-slate-500 text-sm font-medium">Correo Electrónico</span>
            </div>
            <p className="text-slate-900 font-semibold text-lg truncate">{user?.email ?? '—'}</p>
          </div>

          {/* Tarjeta: Roles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <HiOutlineBriefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-slate-500 text-sm font-medium">Roles</span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {user?.roles?.map((role) => (
                <li key={role} className="bg-slate-50 px-2 py-1 rounded text-xs text-slate-600 font-mono border border-slate-200">
                  {role}
                </li>
              ))}
            </ul>
          </div>

          {/* Tarjeta: Token JWT */}
          <div className="sm:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <HiOutlineShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-slate-500 text-sm font-medium block">Token de Autorización (JWT)</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-500 break-all border border-slate-100">
              {user ? localStorage.getItem('aifront_token') ?? '' : '—'}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
