import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductoMaterial } from './producto-material.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producto')
export class Producto {
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

  @ApiProperty({ type: () => ProductoMaterial, isArray: true })
  @OneToMany(() => ProductoMaterial, (pm) => pm.producto, { cascade: true })
  productoMateriales: ProductoMaterial[];
}
