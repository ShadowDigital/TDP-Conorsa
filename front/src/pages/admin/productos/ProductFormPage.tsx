import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../components/MainLayout';
import { getProducto, createProducto, updateProducto, type CreateProductoDto } from '../../../api/productsApi';
import { getMateriales, createMaterial, type Material, type CreateMaterialDto } from '../../../api/materialsApi';
import { HiOutlineRectangleGroup, HiPlus, HiXMark } from 'react-icons/hi2';

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateProductoDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidad: '',
    materiales: [],
  });

  const [allMateriales, setAllMateriales] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState<CreateMaterialDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidad: '',
    coste: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, [id, isEdit]);

  const fetchInitialData = async () => {
    try {
      const { data: materialsData } = await getMateriales();
      setAllMateriales(materialsData);

      if (isEdit && id) {
        const { data: productData } = await getProducto(id);
        setFormData({
          codigo: productData.codigo,
          nombre: productData.nombre,
          descripcion: productData.descripcion || '',
          unidad: productData.unidad,
          materiales: productData.productoMateriales.map(pm => ({
            id: pm.materialId,
            cantidad: Number(pm.cantidad)
          })),
        });
      }
    } catch (err) {
        if (err instanceof Error) {
        // Si es una instancia de Error estándar
        setError(err.message || 'Error al cargar los datos');
      } else if (err && typeof err === 'object' && 'response' in err) {
        // Si es un error de Axios u similar
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al cargar los datos');
      } else {
        setError('Error desconocido al cargar los datos');
      }
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaterial = (materialId: string) => {
    setFormData(prev => {
      const current = prev.materiales || [];
      const exists = current.find(m => m.id === materialId);
      const newMaterials = exists
        ? current.filter(m => m.id !== materialId)
        : [...current, { id: materialId, cantidad: 1 }];
      return { ...prev, materiales: newMaterials };
    });
  };

  const updateMaterialQuantity = (materialId: string, cantidad: number) => {
    setFormData(prev => ({
      ...prev,
      materiales: (prev.materiales || []).map(m =>
        m.id === materialId ? { ...m, cantidad } : m
      )
    }));
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingMaterial(true);
    try {
      const { data: createdMaterial } = await createMaterial(newMaterial);
      setAllMateriales(prev => [...prev, createdMaterial]);
      setFormData(prev => ({
        ...prev,
        materiales: [...(prev.materiales || []), { id: createdMaterial.id, cantidad: 1 }]
      }));
      setIsModalOpen(false);
      setNewMaterial({
        codigo: '',
        nombre: '',
        descripcion: '',
        unidad: '',
        coste: 0,
      });
    } catch (err) {
        if (err instanceof Error) {
        // Si es una instancia de Error estándar
        setError(err.message || 'Error al crear el material');
      } else if (err && typeof err === 'object' && 'response' in err) {
        // Si es un error de Axios u similar
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al crear el material');
      } else {
        setError('Error desconocido al crear el material');
      }
    } finally {
      setIsCreatingMaterial(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await updateProducto(id, formData);
      } else {
        await createProducto(formData);
      }
      navigate('/admin/products');
    } catch (err) {
      if (err instanceof Error) {
        // Si es una instancia de Error estándar
        setError(err.message || 'Error al guardar el producto');
      } else if (err && typeof err === 'object' && 'response' in err) {
        // Si es un error de Axios u similar
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al guardar el producto');
      } else {
        setError('Error desconocido al guardar el producto');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={'Gestión de Productos'}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button> */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                <HiOutlineRectangleGroup className="w-4 h-4" />
              </div>
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p className="text-slate-500 text-sm">{isEdit ? 'Edita la información del producto y sus componentes.' : 'Añade un nuevo producto a la lista de productos.'}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Principal */}
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Código Alfanumérico</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.codigo}
                                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                                    placeholder="Ej. PROD-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Unidad de Medida</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.unidad}
                                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                                    placeholder="Ej. m3, ud, pack"
                                />
                            </div>
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Nombre del Producto</label>
                        <input
                            type="text"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                            placeholder="Ej. Hormigón de alta resistencia"
                        />
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Descripción</label>
                        <textarea
                            rows={4}
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400 resize-none"
                            placeholder="Uso recomendado, especificaciones técnicas..."
                        />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                        <h3 className="text-sm font-bold text-slate-900">Materiales Seleccionados</h3>
                        <p className="text-[10px] text-slate-500">Componentes que forman este producto.</p>
                        </div>

                        <div className="flex items-center gap-2 flex-1 max-w-md">
                        <select
                            className="flex-1 bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none transition-all cursor-pointer"
                            onChange={(e) => {
                            if (e.target.value) {
                                toggleMaterial(e.target.value);
                                e.target.value = '';
                            }
                            }}
                            value=""
                        >
                            <option value="" disabled>Añadir material...</option>
                            {allMateriales
                            .filter(m => !formData.materiales?.some(sm => sm.id === m.id))
                            .map(m => (
                                <option key={m.id} value={m.id}>
                                {m.nombre} ({m.codigo})
                                </option>
                            ))
                            }
                        </select>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-2 rounded-xl transition-colors shrink-0"
                        >
                            <HiPlus className="w-3.5 h-3.5" />
                            Nuevo
                        </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40">Cantidad</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40 text-right">Coste/Ud</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40 text-right">Coste</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {formData.materiales?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center">
                                <p className="text-xs text-slate-400 italic">No hay materiales seleccionados.</p>
                                <p className="text-[10px] text-slate-400 mt-1">Selecciona materiales de la lista lateral.</p>
                                </td>
                            </tr>
                            ) : (
                            formData.materiales?.map((sm) => {
                                const material = allMateriales.find(m => m.id === sm.id);
                                if (!material) return null;

                                return (
                                <tr key={sm.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                    <span className="text-xs font-mono text-slate-500">{material.codigo}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                    <div className="text-xs font-bold text-slate-900">{material.nombre}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                    <div className="relative">
                                        <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={sm.cantidad}
                                        onChange={(e) => updateMaterialQuantity(sm.id, parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg px-2 py-1.5 text-xs text-slate-900 outline-none transition-all pr-8"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase">
                                        {material.unidad}
                                        </span>
                                    </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {Number(material.coste).toFixed(2)} €/{material.unidad}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                            {Number(material.coste * sm.cantidad).toFixed(2)} €
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => toggleMaterial(sm.id)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <HiXMark className="w-4 h-4" />
                                    </button>
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
            <div className="flex gap-3 max-w-4xl mx-auto mt-8">
                <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition-colors text-sm border border-slate-200"
                >
                    Cancelar
                </button>
                <button
                    type='submit'
                    // onClick={() => handleSubmit({ preventDefault: () => { } } as any)}
                    disabled={isSaving}
                    className="flex-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm shadow-lg shadow-brand-500/20"
                >
                    {isSaving ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
            </div>
        </form>
        </div>


      {/* Modal de Nuevo Material */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Nuevo Componente</h2>
                <p className="text-xs text-slate-500">Crea un nuevo material para el catálogo.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Código</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.codigo}
                    onChange={(e) => setNewMaterial({ ...newMaterial, codigo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 transition-all outline-none"
                    placeholder="MAT-001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Unidad</label>
                  <input
                    type="text"
                    required
                    value={newMaterial.unidad}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unidad: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 transition-all outline-none"
                    placeholder="kg, m2, ud"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Coste (€/ud de medida)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={newMaterial.coste}
                    onChange={(e) => setNewMaterial({ ...newMaterial, coste: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 transition-all outline-none"
                    placeholder="kg, m2, ud"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={newMaterial.nombre}
                  onChange={(e) => setNewMaterial({ ...newMaterial, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 transition-all outline-none"
                  placeholder="Nombre del componente"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Descripción (Opcional)</label>
                <textarea
                  rows={2}
                  value={newMaterial.descripcion}
                  onChange={(e) => setNewMaterial({ ...newMaterial, descripcion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-3 py-2 text-sm text-slate-900 transition-all outline-none resize-none"
                  placeholder="Pequeña descripción..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingMaterial}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-lg shadow-brand-500/20"
                >
                  {isCreatingMaterial ? 'Creando...' : 'Crear y Añadir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
