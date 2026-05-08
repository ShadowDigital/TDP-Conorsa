import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { registrarAsistencia, getEstadoHoy, TipoAsistencia, type AsistenciaEstado } from '../../api/asistenciaApi';
import { HiOutlineClock, HiOutlinePlay, HiOutlinePause, HiOutlineStop } from 'react-icons/hi2';

const MOTIVOS_PAUSA = [
  'Descanso/Café',
  'Comida',
  'Asuntos Personales',
  'Médico',
  'Otros'
];

export function AsistenciaPage() {
  const [estado, setEstado] = useState<AsistenciaEstado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(MOTIVOS_PAUSA[0]);

  useEffect(() => {
    fetchEstado();
  }, []);

  const fetchEstado = async () => {
    try {
      const { data } = await getEstadoHoy();
      setEstado(data);
    } catch (err) {
      console.error('Error al obtener el estado:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (tipo: TipoAsistencia, motivo?: string) => {
    setIsActionLoading(true);
    try {
      await registrarAsistencia(tipo, motivo);
      await fetchEstado();
      if (tipo === TipoAsistencia.PAUSA) setShowPauseModal(false);
    } catch (err) {
      alert('Error al registrar la acción');
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <MainLayout title="Control de Horas">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Control de Horas">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Resumen de Estado */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estado Actual</h2>
              <div className="flex items-center gap-3">
                {estado?.haFinalizado ? (
                  <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                    <HiOutlineStop className="w-4 h-4" />
                    Jornada Finalizada
                  </div>
                ) : estado?.enPausa ? (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                    <HiOutlinePause className="w-4 h-4" />
                    En Pausa ({estado.ultimaPausa?.motivo_pausa})
                  </div>
                ) : estado?.haIniciado ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                    <HiOutlinePlay className="w-4 h-4" />
                    En Jornada
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-sm font-medium">
                    <HiOutlineClock className="w-4 h-4" />
                    Sin Iniciar
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:border-l md:border-slate-100 md:pl-8">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Inicio Jornada</p>
                <p className="text-xl font-bold text-slate-900">{formatTime(estado?.inicioJornada ?? null)}</p>
              </div>
              {estado?.enPausa && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Inicio Pausa</p>
                  <p className="text-xl font-bold text-amber-600">{formatTime(estado.ultimaPausa?.fecha_hora ?? null)}</p>
                </div>
              )}
              {estado?.haFinalizado && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Fin Jornada</p>
                  <p className="text-xl font-bold text-slate-900">{formatTime(estado.finJornada)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleAction(TipoAsistencia.INICIO_JORNADA)}
            disabled={estado?.haIniciado || isActionLoading}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <HiOutlinePlay className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900">Inicio Jornada</span>
          </button>

          <button
            onClick={() => setShowPauseModal(true)}
            disabled={!estado?.haIniciado || estado.enPausa || estado.haFinalizado || isActionLoading}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <HiOutlinePause className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900">Pausa</span>
          </button>

          <button
            onClick={() => handleAction(TipoAsistencia.FIN_PAUSA)}
            disabled={!estado?.enPausa || estado.haFinalizado || isActionLoading}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <HiOutlinePlay className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900">Fin de Pausa</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Deseas finalizar tu jornada laboral?')) {
                handleAction(TipoAsistencia.FIN_JORNADA);
              }
            }}
            disabled={!estado?.haIniciado || estado.haFinalizado || isActionLoading}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <HiOutlineStop className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900">Fin Jornada</span>
          </button>
        </div>

        {/* Historial del día */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 ml-1">Actividad de Hoy</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estado?.registros.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No hay actividad registrada hoy.</td>
                  </tr>
                ) : (
                  estado?.registros.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                        {formatTime(r.fecha_hora)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${r.tipo === TipoAsistencia.INICIO_JORNADA ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            r.tipo === TipoAsistencia.FIN_JORNADA ? 'bg-slate-100 text-slate-700 border-slate-200' :
                              r.tipo === TipoAsistencia.PAUSA ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}>
                          {r.tipo.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {r.motivo_pausa || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Pausa */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Seleccionar motivo</h3>
            <p className="text-slate-500 text-sm mb-6">Indica por qué estás iniciando una pausa.</p>

            <div className="space-y-2 mb-8">
              {MOTIVOS_PAUSA.map((m) => (
                <button
                  key={m}
                  onClick={() => setMotivoSeleccionado(m)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${motivoSeleccionado === m
                      ? 'bg-brand-50 border-brand-200 text-brand-600 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAction(TipoAsistencia.PAUSA, motivoSeleccionado)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
