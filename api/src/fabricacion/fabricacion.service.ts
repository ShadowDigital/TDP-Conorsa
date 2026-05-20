import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProductoFabricado, MaterialUsado } from './entities/fabricacion.entities';
import { CreateFabricacionDto } from './dto/create-fabricacion.dto';
import { Producto } from '../productos/entities/producto.entity';
import { Material } from '../materiales/entities/material.entity';

@Injectable()
export class FabricacionService {
  constructor(
    @InjectRepository(ProductoFabricado)
    private readonly pfRepository: Repository<ProductoFabricado>,
    @InjectRepository(MaterialUsado)
    private readonly muRepository: Repository<MaterialUsado>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async create(createDto: CreateFabricacionDto) {
    const { materiales, ...productData } = createDto;

    let coste_real = 0;
    const materialesUsadosToSave: MaterialUsado[] = [];

    // Calcular coste real y preparar materiales usados
    for (const m of materiales) {
      const materialDb = await this.materialRepository.findOne({ where: { codigo: m.codigo_material } });
      const coste_unitario = materialDb ? materialDb.coste : 0;
      coste_real += m.cantidad * coste_unitario;

      materialesUsadosToSave.push(
        this.muRepository.create({
          ...m,
          coste_unitario
        })
      );
    }

    // Calcular coste teórico y coste de desperdicio
    let coste_teorico = 0;
    let coste_desperdicio = 0;
    const productoDb = await this.productoRepository.findOne({ 
      where: { codigo: productData.codigo_producto },
      relations: ['productoMateriales', 'productoMateriales.material']
    });

    if (productoDb && productoDb.productoMateriales) {
      let costeUnidadTeorico = 0;
      for (const pm of productoDb.productoMateriales) {
        costeUnidadTeorico += pm.cantidad * (pm.material ? pm.material.coste : 0);
      }
      coste_teorico = costeUnidadTeorico * productData.cantidad;
      coste_desperdicio = costeUnidadTeorico * (productData.desperdicio || 0);
    }

    const productoFabricado = this.pfRepository.create({
      ...productData,
      coste_teorico,
      coste_desperdicio,
      coste_real,
      materialesUsados: materialesUsadosToSave
    });

    return await this.pfRepository.save(productoFabricado);
  }

  async findAll() {
    return await this.pfRepository.find({
      relations: ['materialesUsados'],
      order: { fecha: 'DESC' }
    });
  }

  async getInformeCostes(startDate: Date, endDate: Date) {
    return await this.pfRepository.find({
      where: {
        fecha: Between(startDate, endDate)
      },
      order: { fecha: 'DESC' }
    });
  }
}
