import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '../../../components/MainLayout';
import { getProductos, deleteProducto, type Producto } from '../../../api/productsApi';
import { Link } from 'react-router-dom';
import { HiPlus, HiOutlinePencil, HiOutlineTrash, HiOutlineRectangleGroup, HiChevronUp, HiChevronDown } from 'react-icons/hi2';

export function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting State
  const [sortField, setSortField] = useState<'codigo' | 'nombre' | null>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchProductos();
  }, []);

  // Resetear a la página 1 al realizar una búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Desplazar el contenedor principal hacia arriba suavemente al cambiar de página
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const timer = setTimeout(() => {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

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

  const handleSort = (field: 'codigo' | 'nombre') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page
  };

  // Filtro de búsqueda
  const filteredProductos = useMemo(() => {
    if (!searchQuery.trim()) return productos;
    const query = searchQuery.toLowerCase().trim();
    return productos.filter(p => {
      const codigoMatch = p.codigo?.toLowerCase().includes(query);
      const nombreMatch = p.nombre?.toLowerCase().includes(query);
      const descMatch = p.descripcion?.toLowerCase().includes(query);
      const unidadMatch = p.unidad?.toLowerCase().includes(query);
      const materialsMatch = p.productoMateriales?.some(pm =>
        pm.material?.nombre?.toLowerCase().includes(query)
      );
      return codigoMatch || nombreMatch || descMatch || unidadMatch || materialsMatch;
    });
  }, [productos, searchQuery]);

  // Sort Logic
  const sortedProductos = useMemo(() => {
    if (!sortField) return filteredProductos;

    return [...filteredProductos].sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (sortField === 'codigo') {
        valA = a.codigo || '';
        valB = b.codigo || '';
      } else if (sortField === 'nombre') {
        valA = a.nombre || '';
        valB = b.nombre || '';
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortDirection === 'asc'
          ? valA - valB
          : valB - valA;
      }
    });
  }, [filteredProductos, sortField, sortDirection]);

  // Pagination Logic
  const paginatedProductos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProductos.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProductos, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProductos.length / itemsPerPage);

  const SortHeader = ({ field, label }: { field: 'codigo' | 'nombre', label: string }) => {
    return (
      <th
        onClick={() => handleSort(field)}
        className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100/50 transition-colors select-none"
      >
        <div className="flex items-center gap-1.5">
          {label}
          {sortField === field ? (
            sortDirection === 'asc' ? (
              <HiChevronUp className="w-3.5 h-3.5 text-brand-600 font-bold" />
            ) : (
              <HiChevronDown className="w-3.5 h-3.5 text-brand-600 font-bold" />
            )
          ) : (
            <div className="flex flex-col opacity-80">
              <HiChevronUp className="w-2 h-2 -mb-0.5 text-slate-700 font-bold" />
              <HiChevronDown className="w-2 h-2 text-slate-700 font-bold" />
            </div>
          )}
        </div>
      </th>
    );
  };

  return (
    <MainLayout title="Gestión de Productos">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                <HiOutlineRectangleGroup className="w-4 h-4" />
              </div>
              Productos
            </h1>
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


          {/* Table Header/Toolbar */}
          {!isLoading && (
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por código, nombre, material..."
                  className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Items per Page and Count */}
              <div className="flex flex-wrap items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                {productos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Mostrar</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer"
                    >
                      {[5, 10, 25, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-slate-500 font-medium">por página</span>
                  </div>
                )}
                
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {filteredProductos.length === 0 ? (
                    <span>No hay resultados</span>
                  ) : (
                    <span>Total: {filteredProductos.length}</span>
                  )}
                </span>
              </div>
            </div>
          )}



          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <SortHeader field="codigo" label="Código" />
                  <SortHeader field="nombre" label="Nombre" />
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">Unidad</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">Materiales</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right select-none">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-10" /></td>
                      <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-10" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                    </tr>
                  ))
                ) : (!productos || productos.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No hay productos registrados.</td>
                  </tr>
                ) : (
                  paginatedProductos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{p.codigo}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{p.nombre}</div>
                            <div className="text-xs text-slate-400">{p.descripcion ? p.descripcion : '---'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500 text-center">{p.unidad}</td>
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

          {/* Pagination Controls */}
          {!isLoading && sortedProductos.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">


              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 justify-end w-full">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                          ? 'bg-brand-600 text-white shadow-sm border border-brand-600'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

