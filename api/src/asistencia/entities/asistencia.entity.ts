import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoAsistencia {
  INICIO_JORNADA = 'inicio_jornada',
  PAUSA = 'pausa',
  FIN_PAUSA = 'fin_pausa',
  FIN_JORNADA = 'fin_jornada',
}

@Entity('asistencia')
export class Asistencia {
  @ApiProperty({ description: 'ID del registro de asistencia' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: false })
  user: User;

  @Column()
  userId: string;

  @ApiProperty({ enum: TipoAsistencia, description: 'Tipo de acción realizada' })
  @Column({
    type: 'enum',
    enum: TipoAsistencia,
  })
  tipo: TipoAsistencia;

  @ApiProperty({ description: 'Motivo de la pausa (opcional)' })
  @Column({ type: 'varchar', nullable: true })
  motivo_pausa?: string;

  @ApiProperty({ description: 'Fecha y hora del registro' })
  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora: Date;
}
