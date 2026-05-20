import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('producto_fabricado')
export class ProductoFabricado {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  codigo_producto: string;

  @ApiProperty()
  @Column()
  nombre_producto: string;

  @ApiProperty()
  @Column()
  unidad: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  desperdicio: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  coste_desperdicio: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  coste_teorico: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  coste_real: number;

  @ApiProperty()
  @CreateDateColumn()
  fecha: Date;

  @ApiProperty()
  @Column()
  pedido: string;

  @ApiProperty({ type: () => MaterialUsado, isArray: true })
  @OneToMany(() => MaterialUsado, (mu) => mu.productoFabricado, { cascade: true })
  materialesUsados: MaterialUsado[];
}

@Entity('material_usado')
export class MaterialUsado {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  producto_fabricado_id: string;

  @ApiProperty()
  @Column()
  codigo_material: string;

  @ApiProperty()
  @Column()
  nombre_maaterial: string;

  @ApiProperty()
  @Column()
  unidades: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  coste_unitario: number;

  @ManyToOne(() => ProductoFabricado, (pf) => pf.materialesUsados, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_fabricado_id' })
  productoFabricado: ProductoFabricado;
}
