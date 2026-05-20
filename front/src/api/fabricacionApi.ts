import { publicApiClient } from './apiClient';

export interface MaterialUsado {
  codigo_material: string;
  nombre_maaterial: string;
  unidades: string;
  cantidad: number;
}

export interface CreateFabricacionDto {
  codigo_producto: string;
  nombre_producto: string;
  unidad: string;
  cantidad: number;
  desperdicio?: number;
  pedido: string;
  materiales: MaterialUsado[];
}

export const saveFabricacion = (data: CreateFabricacionDto) => publicApiClient.post('/fabricacion', data);
export const getFabricaciones = () => publicApiClient.get('/fabricacion');
