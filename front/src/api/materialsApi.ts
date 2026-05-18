import { apiClient as api } from './apiClient';

export interface Material {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  coste: number;
}

export type CreateMaterialDto = Omit<Material, 'id'>;
export type UpdateMaterialDto = Partial<CreateMaterialDto>;

export const getMateriales = () => api.get<Material[]>('/materiales');
export const getMaterial = (id: string) => api.get<Material>(`/materiales/${id}`);
export const createMaterial = (data: CreateMaterialDto) => api.post<Material>('/materiales', data);
export const updateMaterial = (id: string, data: UpdateMaterialDto) => api.patch<Material>(`/materiales/${id}`, data);
export const deleteMaterial = (id: string) => api.delete(`/materiales/${id}`);
