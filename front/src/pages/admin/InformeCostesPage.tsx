import { useState } from 'react';
import { HiOutlineChartBar } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { MainLayout } from '../../components/MainLayout';
import { apiClient as api } from '../../api/apiClient';

interface InformeCostesRow {
  id: string;
  codigo_producto: string;
  nombre_producto: string;
  fecha: string;
  coste_teorico: number;
  coste_real: number;
}

export function InformeCostesPage() {
  const { token } = useAuth();

  // Set default dates to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [data, setData] = useState<InformeCostesRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInforme = async () => {
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/fabricacion/costes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
      });
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el informe de costes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Calcular totales
  const totalTeorico = data.reduce((acc, row) => acc + Number(row.coste_teorico || 0), 0);
  const totalReal = data.reduce((acc, row) => acc + Number(row.coste_real || 0), 0);
  const totalDiferencia = totalReal - totalTeorico;
  const totalDiferenciaPct = totalTeorico > 0 ? (totalDiferencia / totalTeorico) * 100 : 0;

  return (
    <MainLayout title="Informe de Costes">
      <div className="space-y-6">
        {/* Encabezado y Filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={fetchInforme}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <HiOutlineChartBar className="w-5 h-5" />
                  Calcular
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Totales Resumen */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Coste Teórico Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalTeorico)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Coste Real Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalReal)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Diferencia Total</p>
              <p className={`text-2xl font-bold mt-1 ${totalDiferencia > 0 ? 'text-red-600' : totalDiferencia < 0 ? 'text-green-600' : 'text-slate-900'}`}>
                {totalDiferencia > 0 ? '+' : ''}{formatCurrency(totalDiferencia)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Diferencia (%)</p>
              <p className={`text-2xl font-bold mt-1 ${totalDiferenciaPct > 0 ? 'text-red-600' : totalDiferenciaPct < 0 ? 'text-green-600' : 'text-slate-900'}`}>
                {totalDiferenciaPct > 0 ? '+' : ''}{totalDiferenciaPct.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Tabla de Resultados */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                  <th className="px-6 py-4 font-medium">Producto</th>
                  <th className="px-6 py-4 font-medium text-right">C. Teórico</th>
                  <th className="px-6 py-4 font-medium text-right">C. Real</th>
                  <th className="px-6 py-4 font-medium text-right">Diferencia</th>
                  <th className="px-6 py-4 font-medium text-right">Dif. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No hay datos para el periodo seleccionado.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => {
                    const cTeorico = Number(row.coste_teorico || 0);
                    const cReal = Number(row.coste_real || 0);
                    const difAbs = cReal - cTeorico;
                    const difPct = cTeorico > 0 ? (difAbs / cTeorico) * 100 : 0;

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">{new Date(row.fecha).toLocaleDateString()}</td>
                        <td className="px-6 py-3">
                          <span className="font-medium text-slate-900">{row.nombre_producto}</span>
                          <span className="text-xs text-slate-500 ml-2">({row.codigo_producto})</span>
                        </td>
                        <td className="px-6 py-3 text-right">{formatCurrency(cTeorico)}</td>
                        <td className="px-6 py-3 text-right">{formatCurrency(cReal)}</td>
                        <td className={`px-6 py-3 text-right font-medium ${difAbs > 0 ? 'text-red-600' : difAbs < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                          {difAbs > 0 ? '+' : ''}{formatCurrency(difAbs)}
                        </td>
                        <td className={`px-6 py-3 text-right font-medium ${difPct > 0 ? 'text-red-600' : difPct < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                          {difPct > 0 ? '+' : ''}{difPct.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
