import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">

      {/* Header */}
      <header className="bg-white border-b-4 border-brand-600 shadow-sm px-8 flex items-center justify-between h-[72px]">
        <img
          src="/logo-conorsa-azul.png"
          alt="Conorsa"
          className="h-12 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
          Sistema de Gestión
        </span>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 py-20 px-8 text-center overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 h-14 bg-slate-100"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-3">
          Construcciones Normalizadas, S.A.
        </h1>
        <p className="text-brand-100 text-lg">
          Selecciona el área a la que deseas acceder
        </p>
      </div>

      {/* Cards */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard
          icon={<DataIcon />}
          title="Entrada de Datos"
          description="Registro e introducción de información operativa y de obra."
          label="Acceder"
          onClick={() => navigate('/entrada-datos')}
        />
        <SectionCard
          icon={<AdminIcon />}
          title="Administración"
          description="Gestión de usuarios, configuración y panel de control del sistema."
          label="Acceder"
          onClick={() => navigate('/login')}
          badge="Acceso restringido"
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} Construcciones Normalizadas, S.A. — Todos los derechos reservados
      </footer>
    </div>
  );
}

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  label: string;
  onClick: () => void;
  badge?: string;
}

function SectionCard({ icon, title, description, label, onClick, badge }: SectionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border-2 border-slate-200 rounded-xl p-9 text-left flex flex-col gap-4 w-full cursor-pointer shadow-sm transition-all duration-200 hover:border-brand-600 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {badge && (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-1.5 text-brand-600 font-semibold text-sm">
        {label}
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </button>
  );
}

function DataIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}