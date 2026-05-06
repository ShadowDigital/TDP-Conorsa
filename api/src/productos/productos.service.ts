import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { ProductoMaterial } from './entities/producto-material.entity';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(ProductoMaterial)
    private readonly pmRepository: Repository<ProductoMaterial>,
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    const { materiales, ...details } = createProductoDto;

    const producto = this.productoRepository.create(details);
    const savedProducto = await this.productoRepository.save(producto);

    if (materiales && materiales.length > 0) {
      const pmRecords = materiales.map(m => this.pmRepository.create({
        productoId: savedProducto.id,
        materialId: m.id,
        cantidad: m.cantidad
      }));
      await this.pmRepository.save(pmRecords);
    }

    return this.findOne(savedProducto.id);
  }

  findAll() {
    return this.productoRepository.find({
      relations: ['productoMateriales', 'productoMateriales.material'],
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['productoMateriales', 'productoMateriales.material']
    });
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const { materiales, ...details } = updateProductoDto;
    const producto = await this.findOne(id);

    this.productoRepository.merge(producto, details);
    const savedProducto = await this.productoRepository.save(producto);

    if (materiales !== undefined) {
      // Eliminar relaciones previas
      await this.pmRepository.delete({ productoId: id });

      if (materiales.length > 0) {
        const pmRecords = materiales.map(m => this.pmRepository.create({
          productoId: id,
          materialId: m.id,
          cantidad: m.cantidad
        }));
        await this.pmRepository.save(pmRecords);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return { deleted: true };
  }
}
