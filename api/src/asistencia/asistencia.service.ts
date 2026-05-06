import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Asistencia, TipoAsistencia } from './entities/asistencia.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { User } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto, user: User) {
    const asistencia = this.asistenciaRepository.create({
      ...createAsistenciaDto,
      userId: user.id,
    });
    return await this.asistenciaRepository.save(asistencia);
  }

  async getEstadoHoy(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const registros = await this.asistenciaRepository.find({
      where: {
        userId,
        fecha_hora: Between(today, tomorrow),
      },
      order: { fecha_hora: 'ASC' },
    });

    const inicioJornada = registros.find(r => r.tipo === TipoAsistencia.INICIO_JORNADA);
    const finJornada = registros.find(r => r.tipo === TipoAsistencia.FIN_JORNADA);
    
    // Buscar la última pausa y si tiene un fin_pausa posterior
    const pausas = registros.filter(r => r.tipo === TipoAsistencia.PAUSA);
    const finesPausa = registros.filter(r => r.tipo === TipoAsistencia.FIN_PAUSA);
    
    const ultimaPausa = pausas.length > 0 ? pausas[pausas.length - 1] : null;
    const ultimoFinPausa = finesPausa.length > 0 ? finesPausa[finesPausa.length - 1] : null;
    
    const enPausa = ultimaPausa && (!ultimoFinPausa || ultimoFinPausa.fecha_hora < ultimaPausa.fecha_hora);

    return {
      registros,
      inicioJornada: inicioJornada?.fecha_hora || null,
      finJornada: finJornada?.fecha_hora || null,
      ultimaPausa: enPausa ? ultimaPausa : null,
      enPausa: !!enPausa,
      haIniciado: !!inicioJornada,
      haFinalizado: !!finJornada,
    };
  }
}
