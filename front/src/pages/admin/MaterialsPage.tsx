import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { getMateriales, deleteMaterial, type Material } from '../../api/materialsApi';
import { Link } from 'react-router-dom';
import { HiPlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCube } from 'react-icons/hi2';

export function MaterialsPage() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMateriales();
  }, []);

  const fetchMateriales = async () => {
    setIsLoading(true);
    try {
      const { data } = await getMateriales();
      const results = Array.isArray(data) ? data : [];
      setMateriales(results);
      console.log('Materiales actualizados:', results.length);
    } catch (err) {
      setError('Error al cargar los materiales');
      setMateriales([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar este material?')) return;
    try {
      await deleteMaterial(id);
      setMateriales(materiales.filter(m => m.id !== id));
    } catch (err) {
      alert('Error al eliminar el material');
    }
  };

  return (
    <MainLayout title="Gestión de Materiales">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Materiales</h1>
            <p className="text-slate-500 text-sm">Administra el catálogo de materiales y sus unidades.</p>
          </div>
          <Link
            to="/admin/materials/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-lg shadow-brand-500/20"
          >
            <HiPlus className="w-4 h-4" />
            Nuevo Material
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unidad</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Coste</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-10" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : (!materiales || materiales.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No hay materiales registrados.</td>
                  </tr>
                ) : (
                  materiales.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{m.codigo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                            <HiOutlineCube className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{m.nombre}</div>
                            <div className="text-xs text-slate-400 truncate max-w-[200px]">{m.descripcion || 'Sin descripción'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          {m.unidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                          {Number(m.coste).toFixed(2)} €/{m.unidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/materials/${m.id}/edit`}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
