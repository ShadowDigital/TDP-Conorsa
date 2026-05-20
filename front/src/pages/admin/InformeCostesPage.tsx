import { useState, useMemo } from 'react';
import { HiOutlineClipboardList, HiOutlineCube, HiOutlineDownload } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { MainLayout } from '../../components/MainLayout';
import { apiClient as api } from '../../api/apiClient';
import { HiOutlineDocumentChartBar } from 'react-icons/hi2';

interface InformeCostesRow {
  id: string;
  codigo_producto: string;
  nombre_producto: string;
  fecha: string;
  coste_teorico: number;
  coste_real: number;
  desperdicio?: number;
  coste_desperdicio?: number;
  pedido?: string;
  cantidad?: number;
}

export function InformeCostesPage() {
  const { token } = useAuth();

  // Set default dates to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [rawData, setRawData] = useState<InformeCostesRow[]>([]);
  const [calculationMode, setCalculationMode] = useState<'pedido' | 'producto' | null>(null);
  const [loadingType, setLoadingType] = useState<'pedido' | 'producto' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInforme = async (mode: 'pedido' | 'producto') => {
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas.');
      return;
    }
    setLoadingType(mode);
    setError(null);
    try {
      const res = await api.get('/fabricacion/costes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate }
      });
      setRawData(res.data);
      setCalculationMode(mode);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener el informe de costes');
      console.error(err);
    } finally {
      setLoadingType(null);
    }
  };

  // Helper para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Exportar la tabla agrupada a un formato de CSV compatible con Excel
  const exportToExcel = () => {
    if (groupedData.length === 0) return;

    let headers: string[] = [];
    if (calculationMode === 'pedido') {
      headers = [
        'Pedido',
        'Código Producto',
        'Producto',
        'Cantidad',
        'Desperdicio',
        'Coste Desperdicio',
        'Coste Teórico',
        'Coste Real',
        'Diferencia',
        'Diferencia %'
      ];
    } else {
      headers = [
        'Código Producto',
        'Producto',
        'Cantidad Total',
        'Desperdicio Total',
        'Coste Desperdicio',
        'Coste Teórico',
        'Coste Real',
        'Diferencia',
        'Diferencia %'
      ];
    }

    const rows: any[] = [];
    groupedData.forEach((row: any) => {
      if (calculationMode === 'pedido') {
        if (row.productosList && row.productosList.length > 0) {
          row.productosList.forEach((p: any) => {
            const cTeorico = Number(p.coste_teorico || 0);
            const cReal = Number(p.coste_real || 0);
            const desperdicioCant = Number(p.desperdicio || 0);
            const desperdicioCoste = Number(p.coste_desperdicio || 0);
            const difAbs = cReal - cTeorico;
            const difPct = cTeorico > 0 ? (difAbs / cTeorico) * 100 : 0;

            rows.push([
              row.pedido,
              p.code,
              p.name,
              p.cantidad,
              desperdicioCant,
              desperdicioCoste,
              cTeorico,
              cReal,
              difAbs,
              difPct.toFixed(2) + '%'
            ]);
          });
        } else {
          const cTeorico = Number(row.coste_teorico || 0);
          const cReal = Number(row.coste_real || 0);
          const desperdicioCant = Number(row.desperdicio || 0);
          const desperdicioCoste = Number(row.coste_desperdicio || 0);
          const difAbs = cReal - cTeorico;
          const difPct = cTeorico > 0 ? (difAbs / cTeorico) * 100 : 0;

          rows.push([
            row.pedido,
            '',
            row.nombre_producto,
            row.cantidadTotal,
            desperdicioCant,
            desperdicioCoste,
            cTeorico,
            cReal,
            difAbs,
            difPct.toFixed(2) + '%'
          ]);
        }
      } else {
        const cTeorico = Number(row.coste_teorico || 0);
        const cReal = Number(row.coste_real || 0);
        const desperdicioCant = Number(row.desperdicio || 0);
        const desperdicioCoste = Number(row.coste_desperdicio || 0);
        const difAbs = cReal - cTeorico;
        const difPct = cTeorico > 0 ? (difAbs / cTeorico) * 100 : 0;

        rows.push([
          row.codigo_producto,
          row.nombre_producto,
          row.cantidadTotal,
          desperdicioCant,
          desperdicioCoste,
          cTeorico,
          cReal,
          difAbs,
          difPct.toFixed(2) + '%'
        ]);
      }
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map((e: any[]) => e.map((val: any) => {
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        if (typeof val === 'number') {
          return val.toString().replace('.', ',');
        }
        return val;
      }).join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    
    const filename = `Informe_Costes_por_${calculationMode === 'pedido' ? 'Pedido' : 'Producto'}_${startDate}_a_${endDate}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Agrupar los datos de fabricación crudos según el modo de cálculo activo
  const groupedData = useMemo(() => {
    if (!calculationMode) return [];

    if (calculationMode === 'pedido') {
      const groups: {
        [key: string]: {
          pedido: string;
          productos: Map<string, {
            nombre: string;
            cantidad: number;
            desperdicio: number;
            coste_teorico: number;
            coste_real: number;
            coste_desperdicio: number;
          }>;
          desperdicio: number;
          coste_desperdicio: number;
          coste_teorico: number;
          coste_real: number;
          cantidadTotal: number;
          fechaMax: Date;
        }
      } = {};

      rawData.forEach((row) => {
        const key = row.pedido || 'Sin Pedido';
        if (!groups[key]) {
          groups[key] = {
            pedido: key,
            productos: new Map<string, {
              nombre: string;
              cantidad: number;
              desperdicio: number;
              coste_teorico: number;
              coste_real: number;
              coste_desperdicio: number;
            }>(),
            desperdicio: 0,
            coste_desperdicio: 0,
            coste_teorico: 0,
            coste_real: 0,
            cantidadTotal: 0,
            fechaMax: new Date(row.fecha),
          };
        }
        const g = groups[key];
        g.desperdicio += Number(row.desperdicio || 0);
        g.coste_desperdicio += Number(row.coste_desperdicio || 0);
        g.coste_teorico += Number(row.coste_teorico || 0);
        g.coste_real += Number(row.coste_real || 0);
        g.cantidadTotal += Number(row.cantidad || 0);

        if (row.nombre_producto) {
          const prodKey = row.codigo_producto;
          const existing = g.productos.get(prodKey);
          if (existing) {
            existing.cantidad += Number(row.cantidad || 0);
            existing.desperdicio += Number(row.desperdicio || 0);
            existing.coste_teorico += Number(row.coste_teorico || 0);
            existing.coste_real += Number(row.coste_real || 0);
            existing.coste_desperdicio += Number(row.coste_desperdicio || 0);
          } else {
            g.productos.set(prodKey, {
              nombre: row.nombre_producto,
              cantidad: Number(row.cantidad || 0),
              desperdicio: Number(row.desperdicio || 0),
              coste_teorico: Number(row.coste_teorico || 0),
              coste_real: Number(row.coste_real || 0),
              coste_desperdicio: Number(row.coste_desperdicio || 0),
            });
          }
        }

        const rowDate = new Date(row.fecha);
        if (rowDate > g.fechaMax) {
          g.fechaMax = rowDate;
        }
      });

      return Object.values(groups).map((g) => ({
        id: g.pedido,
        pedido: g.pedido,
        nombre_producto: Array.from(g.productos.entries())
          .map(([code, p]) => `${p.nombre} (${code})`)
          .join(', '),
        productosList: Array.from(g.productos.entries()).map(([code, p]) => ({
          code,
          name: p.nombre,
          cantidad: p.cantidad,
          desperdicio: p.desperdicio,
          coste_teorico: p.coste_teorico,
          coste_real: p.coste_real,
          coste_desperdicio: p.coste_desperdicio,
        })),
        desperdicio: g.desperdicio,
        coste_desperdicio: g.coste_desperdicio,
        coste_teorico: g.coste_teorico,
        coste_real: g.coste_real,
        cantidadTotal: g.cantidadTotal,
        fecha: g.fechaMax.toISOString(),
      }));
    } else {
      // calculationMode === 'producto'
      const groups: {
        [key: string]: {
          codigo_producto: string;
          nombre_producto: string;
          desperdicio: number;
          coste_desperdicio: number;
          coste_teorico: number;
          coste_real: number;
          cantidadTotal: number;
          fechaMax: Date;
        }
      } = {};

      rawData.forEach((row) => {
        const key = row.codigo_producto;
        if (!groups[key]) {
          groups[key] = {
            codigo_producto: row.codigo_producto,
            nombre_producto: row.nombre_producto,
            desperdicio: 0,
            coste_desperdicio: 0,
            coste_teorico: 0,
            coste_real: 0,
            cantidadTotal: 0,
            fechaMax: new Date(row.fecha),
          };
        }
        const g = groups[key];
        g.desperdicio += Number(row.desperdicio || 0);
        g.coste_desperdicio += Number(row.coste_desperdicio || 0);
        g.coste_teorico += Number(row.coste_teorico || 0);
        g.coste_real += Number(row.coste_real || 0);
        g.cantidadTotal += Number(row.cantidad || 0);

        const rowDate = new Date(row.fecha);
        if (rowDate > g.fechaMax) {
          g.fechaMax = rowDate;
        }
      });

      return Object.values(groups).map((g) => ({
        id: g.codigo_producto,
        codigo_producto: g.codigo_producto,
        nombre_producto: g.nombre_producto,
        desperdicio: g.desperdicio,
        coste_desperdicio: g.coste_desperdicio,
        coste_teorico: g.coste_teorico,
        coste_real: g.coste_real,
        cantidadTotal: g.cantidadTotal,
        fecha: g.fechaMax.toISOString(),
      }));
    }
  }, [rawData, calculationMode]);

  // Calcular totales agregados
  const totalTeorico = groupedData.reduce((acc, row) => acc + Number(row.coste_teorico || 0), 0);
  const totalReal = groupedData.reduce((acc, row) => acc + Number(row.coste_real || 0), 0);
  const totalDesperdicioCost = groupedData.reduce((acc, row) => acc + Number(row.coste_desperdicio || 0), 0);
  const totalDiferencia = totalReal - totalTeorico;
  const totalDiferenciaPct = totalTeorico > 0 ? (totalDiferencia / totalTeorico) * 100 : 0;

  return (
    <MainLayout title="Informe de Costes">
      <div className="space-y-6">


                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                        <HiOutlineDocumentChartBar className="w-4 h-4" />
                        </div>
                        Informe de Costes
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Selecciona el rango de fechas para el cálculo de costes.
                    </p>
                </div>


        {/* Encabezado y Filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => fetchInforme('pedido')}
                disabled={loadingType !== null}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white 
                font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loadingType === 'pedido' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineClipboardList className="w-5 h-5" />
                    Calcular por Pedido
                  </>
                )}
              </button>
              <button
                onClick={() => fetchInforme('producto')}
                disabled={loadingType !== null}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-600 text-white 
                font-medium rounded-xl hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loadingType === 'producto' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineCube className="w-5 h-5" />
                    Calcular por Producto
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Totales Resumen */}
        {groupedData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Coste Teórico Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalTeorico)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Coste Real Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalReal)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm font-medium text-slate-500">Coste Desperdicio Total</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalDesperdicioCost)}</p>
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
          {groupedData.length > 0 && (
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Desglose por {calculationMode === 'pedido' ? 'Pedido' : 'Producto'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Rango: {new Date(startDate).toLocaleDateString()} al {new Date(endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={exportToExcel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
              >
                <HiOutlineDownload className="w-4 h-4" />
                Exportar a Excel
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  {calculationMode === 'pedido' ? (
                    <>
                      <th className="px-6 py-4 font-medium">Pedido</th>
                      <th className="px-6 py-4 font-medium">Productos Fabricados</th>
                    </>
                  ) : (
                    <th className="px-6 py-4 font-medium">Producto</th>
                  )}
                  <th className="px-6 py-4 font-medium text-right">Cantidad</th>
                  <th className="px-6 py-4 font-medium text-right">Desperdicio</th>
                  <th className="px-6 py-4 font-medium text-right">C. Desperdicio</th>
                  <th className="px-6 py-4 font-medium text-right">C. Teórico</th>
                  <th className="px-6 py-4 font-medium text-right">C. Real</th>
                  <th className="px-6 py-4 font-medium text-right">Diferencia</th>
                  <th className="px-6 py-4 font-medium text-right">Dif. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedData.length === 0 ? (
                  <tr>
                    <td colSpan={calculationMode === 'pedido' ? 9 : 8} className="px-6 py-8 text-center text-slate-500">
                      {calculationMode ? 'No hay datos para el periodo seleccionado.' : 'Selecciona un rango de fechas y haz clic en Calcular.'}
                    </td>
                  </tr>
                ) : (
                  groupedData.map((row: any) => {
                    const cTeorico = Number(row.coste_teorico || 0);
                    const cReal = Number(row.coste_real || 0);
                    const desperdicioCant = Number(row.desperdicio || 0);
                    const desperdicioCoste = Number(row.coste_desperdicio || 0);
                    const difAbs = cReal - cTeorico;
                    const difPct = cTeorico > 0 ? (difAbs / cTeorico) * 100 : 0;

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        {calculationMode === 'pedido' ? (
                          <>
                            <td className="px-6 py-3 font-semibold text-slate-900">{row.pedido}</td>
                            <td className="px-6 py-3">
                              <div className="flex flex-wrap gap-1.5 max-w-xs sm:max-w-md md:max-w-lg">
                                {row.productosList && row.productosList.map((p: any) => (
                                  <span key={p.code} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-sm gap-1.5">
                                    <span className="font-semibold">{p.name}</span>
                                    <span className="text-[10px] text-slate-500">({p.code})</span>
                                    <span className="inline-flex items-center px-1.5 py-0.25 rounded bg-indigo-50 text-[10px] text-indigo-700 font-bold border border-indigo-100">
                                      Cant: {p.cantidad}
                                    </span>
                                    <span className="inline-flex items-center px-1.5 py-0.25 rounded bg-red-50 text-[10px] text-red-700 font-bold border border-red-100">
                                      Desp: {p.desperdicio}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </td>
                          </>
                        ) : (
                          <td className="px-6 py-3">
                            <span className="font-semibold text-slate-900">{row.nombre_producto}</span>
                            <span className="text-xs text-slate-500 ml-2 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">({row.codigo_producto})</span>
                          </td>
                        )}
                        <td className="px-6 py-3 text-right font-medium text-slate-700">{row.cantidadTotal}</td>
                        <td className="px-6 py-3 text-right font-medium text-slate-600">{desperdicioCant}</td>
                        <td className="px-6 py-3 text-right font-medium text-red-600">{formatCurrency(desperdicioCoste)}</td>
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


