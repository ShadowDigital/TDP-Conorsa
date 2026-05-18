import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductoMaterial } from '../../productos/entities/producto-material.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('material')
export class Material {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  codigo: string;

  @ApiProperty()
  @Column()
  nombre: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty()
  @Column()
  unidad: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  coste: number;

  @OneToMany(() => ProductoMaterial, (pm) => pm.material)
  productoMateriales: ProductoMaterial[];
}
