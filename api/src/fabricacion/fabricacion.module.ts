import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FabricacionService } from './fabricacion.service';
import { FabricacionController } from './fabricacion.controller';
import { ProductoFabricado, MaterialUsado } from './entities/fabricacion.entities';
import { AuthModule } from '../auth/auth.module';
import { Producto } from '../productos/entities/producto.entity';
import { Material } from '../materiales/entities/material.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoFabricado, MaterialUsado, Producto, Material]),
    AuthModule
  ],
  controllers: [FabricacionController],
  providers: [FabricacionService],
  exports: [FabricacionService]
})
export class FabricacionModule {}
