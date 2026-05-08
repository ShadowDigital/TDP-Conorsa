import { apiClient as api } from './apiClient';

export const TipoAsistencia = {
  INICIO_JORNADA: 'inicio_jornada',
  PAUSA: 'pausa',
  FIN_PAUSA: 'fin_pausa',
  FIN_JORNADA: 'fin_jornada',
} as const;

export type TipoAsistencia = typeof TipoAsistencia[keyof typeof TipoAsistencia];

export interface AsistenciaRecord {
  id: string;
  tipo: TipoAsistencia;
  motivo_pausa?: string;
  fecha_hora: string;
}

export interface AsistenciaEstado {
  registros: AsistenciaRecord[];
  inicioJornada: string | null;
  finJornada: string | null;
  ultimaPausa: AsistenciaRecord | null;
  enPausa: boolean;
  haIniciado: boolean;
  haFinalizado: boolean;
}

export const registrarAsistencia = (tipo: TipoAsistencia, motivo_pausa?: string) => {
  return api.post('/asistencia', { tipo, motivo_pausa });
};

export const getEstadoHoy = () => {
  return api.get<AsistenciaEstado>('/asistencia/estado-hoy');
};

export const generarInforme = async (desde: string, hasta: string): Promise<Blob> => {
  const response = await api.post<Blob>('/asistencia/informe', { desde, hasta }, { responseType: 'blob' });
  return response.data;
};
