import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductosPublic, type Producto } from '../../api/productsApi';
import { saveFabricacion } from '../../api/fabricacionApi';

type Step = 'PEDIDO' | 'PRODUCTO' | 'MATERIALES';

interface MaterialEditado {
  materialId: string;
  codigo: string;
  nombre: string;
  unidad: string;
  cantidadTeorica: number;  // cantidad base por unidad de producto
  cantidad: number;         // cantidad real editable (= cantidadTotal * cantidadTeorica)
}

export function EntradaDatosPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('PEDIDO');
  const [pedido, setPedido] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [materialesEditados, setMaterialesEditados] = useState<MaterialEditado[]>([]);
  const [cantidadTotal, setCantidadTotal] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data } = await getProductosPublic();
      setProductos(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProducto = (producto: Producto) => {
    setSelectedProducto(producto);
    const materials = producto.productoMateriales.map(pm => ({
      materialId: pm.materialId,
      codigo: pm.material.codigo,
      nombre: pm.material.nombre,
      unidad: pm.material.unidad,
      cantidadTeorica: pm.cantidad,
      cantidad: pm.cantidad  // cantidadTotal inicial = 1
    }));
    setMaterialesEditados(materials);
    setCantidadTotal(1);
    setStep('MATERIALES');
  };

  const handleMaterialChange = (index: number, val: string) => {
    const newVal = parseFloat(val) || 0;
    const newMats = [...materialesEditados];
    newMats[index].cantidad = newVal;
    setMaterialesEditados(newMats);
  };

  const handleSave = async (finish: boolean) => {
    if (!selectedProducto || !pedido) return;

    try {
      setSaving(true);
      await saveFabricacion({
        pedido,
        codigo_producto: selectedProducto.codigo,
        nombre_producto: selectedProducto.nombre,
        unidad: selectedProducto.unidad,
        cantidad: Number(cantidadTotal),
        materiales: materialesEditados.map(m => ({
          codigo_material: m.codigo,
          nombre_maaterial: m.nombre,
          unidades: m.unidad,
          cantidad: Number(m.cantidad)
        }))
      });

      if (finish) {
        // Reset everything and go back to pedido step
        setPedido('');
        setStep('PEDIDO');
      } else {
        // Just clear product selection and go back to product selection step
        setSelectedProducto(null);
        setSearchTerm('');
        setStep('PRODUCTO');
      }
    } catch (error) {
      console.error('Error saving fabrication:', error);
      alert('Error al guardar la fabricación');
    } finally {
      setSaving(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-8 flex items-center justify-between h-[72px] shrink-0">
        <img
          src="/logo-conorsa-azul.png"
          alt="Conorsa"
          className="h-10 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="flex items-center gap-4">
          {pedido && (
            <div className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold border border-brand-100">
              PEDIDO: {pedido}
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm px-3 py-2 rounded-lg transition-colors hover:bg-slate-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Inicio
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <div className={`absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-300`}
            style={{ width: step === 'PEDIDO' ? '0%' : step === 'PRODUCTO' ? '50%' : '100%' }} />

          <StepIcon active={true} completed={step !== 'PEDIDO'} label="Pedido" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
          <StepIcon active={step === 'PRODUCTO' || step === 'MATERIALES'} completed={step === 'MATERIALES'} label="Producto" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
          <StepIcon active={step === 'MATERIALES'} completed={false} label="Materiales" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {step === 'PEDIDO' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Número de Pedido</h2>
              <p className="text-slate-500 mb-8">Introduce el número de pedido para comenzar la fabricación.</p>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                  placeholder="Ej: P-2024-001"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-center text-lg font-semibold text-brand-600"
                  autoFocus
                />
                <button
                  onClick={() => pedido && setStep('PRODUCTO')}
                  disabled={!pedido}
                  className="w-full mt-6 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-50 disabled:shadow-none"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'PRODUCTO' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Seleccionar Producto</h2>
                  <p className="text-slate-500">Busca el producto por código o nombre.</p>
                </div>
                <button
                  onClick={() => setStep('PEDIDO')}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Cambiar pedido
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400">Cargando productos...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredProductos.map(producto => (
                    <button
                      key={producto.id}
                      onClick={() => handleSelectProducto(producto)}
                      className="flex flex-col items-start p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group"
                    >
                      <span className="text-xs font-bold text-brand-600 mb-1 uppercase tracking-wider">{producto.codigo}</span>
                      <span className="text-slate-900 font-bold group-hover:text-brand-700 transition-colors">{producto.nombre}</span>
                      <span className="text-xs text-slate-400 mt-1">{producto.unidad}</span>
                    </button>
                  ))}
                  {filteredProductos.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-slate-400 italic">No se encontraron productos</div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={() => {
                    setPedido('');
                    setStep('PEDIDO');
                  }}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Finalizar Fabricación
                </button>
              </div>
            </div>
          )}

          {step === 'MATERIALES' && selectedProducto && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-50 border-b border-slate-200 p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-brand-600 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedProducto.nombre}</h2>
                      <p className="text-xs font-bold text-brand-600 uppercase tracking-widest">{selectedProducto.codigo}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('PRODUCTO')}
                    className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                  >
                    Cambiar producto
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Cantidad Total Fabricada ({selectedProducto.unidad})</label>
                    <input
                      type="number"
                      value={cantidadTotal}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setCantidadTotal(val);
                        setMaterialesEditados(prev =>
                          prev.map(m => ({ ...m, cantidad: parseFloat((val * m.cantidadTeorica).toFixed(4)) }))
                        );
                      }}
                      className="w-full text-2xl font-bold text-slate-900 outline-none bg-transparent"
                      placeholder="0.00"
                      autoFocus
                    />
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-center bg-brand-50/30">
                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Pedido</span>
                      <span className="text-lg font-bold text-brand-700">{pedido}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Materiales y Cantidades
                </h3>

                <div className="overflow-hidden border border-slate-100 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-3">Código</th>
                        <th className="px-6 py-3">Material</th>
                        <th className="px-6 py-3 text-right">Teórica/ud</th>
                        <th className="px-6 py-3 text-right">Cantidad ({materialesEditados[0]?.unidad})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {materialesEditados.map((m, idx) => (
                        <tr key={m.materialId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{m.codigo}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{m.nombre}</td>
                          <td className="px-6 py-4 text-right text-sm text-slate-400 font-medium">{m.cantidadTeorica}</td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="number"
                              value={m.cantidad}
                              onChange={(e) => handleMaterialChange(idx, e.target.value)}
                              className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-right font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving || cantidadTotal <= 0}
                    className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Guardando...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Guardar y Siguiente Producto
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving || cantidadTotal <= 0}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Finalizar Fabricación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest shrink-0">
        © {new Date().getFullYear()} Construcciones Normalizadas, S.A. — Gestión de Producción
      </footer>
    </div>
  );
}

function StepIcon({ active, completed, label, icon }: { active: boolean, completed: boolean, label: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 z-10 relative">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${completed ? 'bg-brand-500 border-brand-500 text-white' :
        active ? 'bg-white border-brand-500 text-brand-600 shadow-md scale-110' :
          'bg-white border-slate-200 text-slate-300'
        }`}>
        {completed ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        ) : icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active || completed ? 'text-brand-600' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}