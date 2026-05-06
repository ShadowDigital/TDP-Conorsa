import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) { }

  create(createMaterialDto: CreateMaterialDto) {
    const material = this.materialRepository.create(createMaterialDto);
    return this.materialRepository.save(material);
  }

  findAll() {
    console.log('Service Materials findAll');
    return this.materialRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: string) {
    const material = await this.materialRepository.findOneBy({ id });
    if (!material) throw new NotFoundException(`Material con ID ${id} no encontrado`);
    return material;
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const material = await this.findOne(id);
    this.materialRepository.merge(material, updateMaterialDto);
    return this.materialRepository.save(material);
  }

  async remove(id: string) {
    const material = await this.findOne(id);
    await this.materialRepository.remove(material);
    return { deleted: true };
  }
}
