import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Producto } from './producto.entity';
import { Material } from '../../materiales/entities/material.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producto_materiales')
export class ProductoMaterial {
  @ApiProperty()
  @PrimaryColumn()
  productoId: string;

  @ApiProperty()
  @PrimaryColumn()
  materialId: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
  cantidad: number;

  @ManyToOne(() => Producto, (producto) => producto.productoMateriales, { onDelete: 'CASCADE' })
  producto: Producto;

  @ManyToOne(() => Material, (material) => material.productoMateriales, { onDelete: 'CASCADE' })
  material: Material;
}
