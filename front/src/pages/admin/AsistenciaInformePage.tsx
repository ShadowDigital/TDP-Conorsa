import { useState } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { HiOutlineDocumentArrowDown, HiOutlineCalendar, HiOutlineTrash, HiOutlineClock } from 'react-icons/hi2';
import { generarInforme } from '../../api/asistenciaApi';

export function AsistenciaInformePage() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!desde || !hasta) return;

    // Validación: Hasta no puede ser anterior a Desde
    if (new Date(hasta) < new Date(desde)) {
      setError('La fecha "Hasta" no puede ser anterior a "Desde"');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const blob = await generarInforme(desde, hasta);
      const fileName = `informe_asistencia_${desde}_a_${hasta}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating report', e);
      setError('Error al generar el informe. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDesde('');
    setHasta('');
    setError(null);
  };

  const isValid = desde && hasta && new Date(hasta) >= new Date(desde);

  return (
    <MainLayout title="Informe de Asistencia">

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                        <HiOutlineClock className="w-4 h-4" />
                        </div>
                        Informe de Asistencia
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Selecciona el rango de fechas para exportar todos los registros de jornada en formato Excel.
                    </p>
                    <p className="mt-2 text-slate-500 text-sm">
                    El informe incluirá registros de todos los usuarios activos en el sistema.
                </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

                <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="desde">
                        Fecha Inicial
                    </label>
                    <div className="relative">
                        <input
                        id="desde"
                        type="date"
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                        value={desde}
                        onChange={e => {
                            setDesde(e.target.value);
                            setError(null);
                        }}
                        />
                    </div>
                    </div>

                    <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="hasta">
                        Fecha Final
                    </label>
                    <div className="relative">
                        <input
                        id="hasta"
                        type="date"
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                        value={hasta}
                        onChange={e => {
                            setHasta(e.target.value);
                            setError(null);
                        }}
                        />
                    </div>
                    </div>
                    <button
                    onClick={handleClear}
                    disabled={loading || (!desde && !hasta)}
                    className="px-6 py-2 bg-white text-slate-500 rounded-2xl font-bold hover:bg-slate-50 border border-slate-200 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    title="Limpiar campos"
                    >
                    <HiOutlineTrash className="w-5 h-5" />
                    <span className="sm:hidden">Limpiar</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
                    {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                    onClick={handleDownload}
                    disabled={!isValid || loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 disabled:opacity-40 disabled:grayscale transition-all shadow-lg shadow-brand-200 active:scale-[0.98]"
                    >
                    {loading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generando Excel...
                        </>
                    ) : (
                        <>
                        <HiOutlineDocumentArrowDown className="w-6 h-6" />
                        Descargar Informe
                        </>
                    )}
                    </button>
                </div>
                </div>
            </div>
        </div>

    </MainLayout>
  );
}
