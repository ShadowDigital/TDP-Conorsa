import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoAsistencia } from '../entities/asistencia.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsistenciaDto {
  @ApiProperty({ enum: TipoAsistencia })
  @IsEnum(TipoAsistencia)
  tipo: TipoAsistencia;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motivo_pausa?: string;
}
