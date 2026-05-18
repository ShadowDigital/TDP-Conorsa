import { useNavigate } from 'react-router-dom';
import {
  HiCog,
  HiOutlineDocumentText,
  HiOutlineUserGroup
} from 'react-icons/hi2';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">

      {/* Header */}
      <header className="
        bg-white
        border-b-4 
        border-brand-600 
        shadow-sm 
        px-8 
        flex 
        items-center 
        justify-between 
        h-[72px]
      ">
        <img
          src="/logo-conorsa-azul.png"
          alt="Conorsa"
          className="h-12 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Sistema de Gestión
          </span>
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            <button
              onClick={() => navigate('/admin/welcome')}
              className="group bg-white border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm transition-all duration-200 hover:border-brand-600 hover:shadow-xl hover:-translate-y-1"
            >
              <HiCog className="w-5 h-5" />
            </button>
          </span>
        </div>

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
          icon={<HiOutlineDocumentText className="w-7 h-7" />}
          title="Entrada de Datos"
          description="Registro e introducción de información operativa y de obra."
          label="Acceder"
          onClick={() => navigate('/entrada-datos')}
        />
        <SectionCard
          icon={<HiOutlineUserGroup className="w-7 h-7" />}
          title="Fichaje"
          description="Registro de entradas y salidas del personal."
          label="Acceder"
          onClick={() => navigate('/asistencia')}
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
  badge?: React.ReactNode;
}

function SectionCard({ icon, title, description, label, onClick, badge }: SectionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border-2 border-slate-200 rounded-xl p-9 text-center flex flex-col gap-4 w-full cursor-pointer shadow-sm transition-all duration-200 hover:border-brand-600 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0 mx-auto">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {badge && (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 flex items-center gap-1.5">
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="bg-brand-50 border-2 border-brand-200 rounded-xl px-10 py-4 flex items-center gap-1.5 text-brand-600 font-semibold text-sm mx-auto">
        {label}
      </div>
    </button>
  );
}
