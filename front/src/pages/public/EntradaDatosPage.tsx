import { useNavigate } from 'react-router-dom';

export function EntradaDatosPage() {
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
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-brand-600 font-semibold text-sm px-3 py-2 rounded-lg transition-colors hover:bg-brand-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Inicio
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-18 h-18 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-brand-600 mb-6 mx-auto"
          style={{ width: '72px', height: '72px' }}>
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Entrada de Datos</h1>
        <p className="text-slate-500 text-base leading-relaxed max-w-md mb-8">
          Esta sección está en desarrollo.<br />
          Próximamente podrás registrar e introducir la información operativa desde aquí.
        </p>

        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-4 py-2.5 text-amber-800 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          En construcción
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} Construcciones Normalizadas, S.A. — Todos los derechos reservados
      </footer>
    </div>
  );
}