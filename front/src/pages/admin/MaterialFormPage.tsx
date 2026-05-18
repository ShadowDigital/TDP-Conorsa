import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/MainLayout';
import { getMaterial, createMaterial, updateMaterial, type CreateMaterialDto } from '../../api/materialsApi';
import { HiArrowLeft } from 'react-icons/hi2';

export function MaterialFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateMaterialDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
    unidad: '',
    coste: 0,
  });

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchMaterial(id);
    }
  }, [id, isEdit]);

  /**
   * Fetches a single material by its ID
   */
  const fetchMaterial = async (materialId: string) => {
    try {
      const { data } = await getMaterial(materialId);
      setFormData({
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        unidad: data.unidad,
        coste: data.coste,
      });
    } catch (err) {
      setError('Error al cargar el material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEdit && id) {
        await updateMaterial(id, formData);
      } else {
        await createMaterial(formData);
      }
      navigate('/admin/materials');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el material');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={isEdit ? 'Editar Material' : 'Nuevo Material'}>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEdit ? 'Editar Material' : 'Nuevo Material'}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/materials')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Editar Material' : 'Crear Material'}</h1>
            <p className="text-slate-500 text-sm">Define las propiedades básicas del material.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Código Alfanumérico</label>
                <input
                  type="text"
                  required
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                  placeholder="Ej. MAT-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unidad */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Unidad de Medida</label>
                <input
                  type="text"
                  required
                  value={formData.unidad}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                  placeholder="Ej. m2, kg, ud"
                />
              </div>
              {/* Coste */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Coste (€/ud de medida)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.coste}
                  onChange={(e) => setFormData({ ...formData, coste: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                  placeholder="Ej. 10.00"
                />
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400"
                placeholder="Nombre del material"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">Descripción</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-2.5 text-slate-900 transition-all outline-none placeholder-slate-400 resize-none"
                placeholder="Detalles adicionales..."
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/materials')}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-[2] bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-brand-500/20"
            >
              {isSaving ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Crear Material')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
