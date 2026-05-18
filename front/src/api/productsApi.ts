import { apiClient as api, publicApiClient } from './apiClient';
import type { Material } from './materialsApi';

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  productoMateriales: {
    materialId: string;
    cantidad: number;
    material: Material;
  }[];
}

export interface CreateProductoDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  materiales?: { id: string, cantidad: number }[];
}

export type UpdateProductoDto = Partial<CreateProductoDto>;

export const getProductos = () => api.get<Producto[]>('/productos');
export const getProductosPublic = () => publicApiClient.get<Producto[]>('/productos');
export const getProducto = (id: string) => api.get<Producto>(`/productos/${id}`);
export const createProducto = (data: CreateProductoDto) => api.post<Producto>('/productos', data);
export const updateProducto = (id: string, data: UpdateProductoDto) => api.patch<Producto>(`/productos/${id}`, data);
export const deleteProducto = (id: string) => api.delete(`/productos/${id}`);
