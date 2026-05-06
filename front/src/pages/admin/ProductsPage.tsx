import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { getProductos, deleteProducto, type Producto } from '../../api/productsApi';
import { Link } from 'react-router-dom';
import { HiPlus, HiOutlinePencil, HiOutlineTrash, HiOutlineRectangleGroup } from 'react-icons/hi2';

export function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const { data } = await getProductos();
      const results = Array.isArray(data) ? data : [];
      setProductos(results);
    } catch (err) {
      setError('Error al cargar los productos');
      setProductos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al eliminar el producto');
    }
  };

  return (
    <MainLayout title="Gestión de Productos">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
            <p className="text-slate-500 text-sm">Gestiona el catálogo de productos terminados.</p>
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm shadow-lg shadow-brand-500/20"
          >
            <HiPlus className="w-4 h-4" />
            Nuevo Producto
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Materiales</th>
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
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : (!productos || productos.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No hay productos registrados.</td>
                  </tr>
                ) : (
                  productos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{p.codigo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                            <HiOutlineRectangleGroup className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{p.nombre}</div>
                            <div className="text-xs text-slate-400">{p.unidad}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.productoMateriales.length === 0 ? (
                            <span className="text-[10px] text-slate-400 italic">Sin materiales</span>
                          ) : (
                            p.productoMateriales.map(m => (
                              <span key={m.material.id} className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 text-[10px] font-medium border border-brand-100">
                                {m.material.nombre}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
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
