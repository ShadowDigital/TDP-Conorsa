import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { CreateMaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Materiales')
@ApiBearerAuth()
@Controller('materiales')
@UseGuards(AuthGuard())
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) { }

  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialesService.create(createMaterialDto);
  }

  @Get()
  findAll() {
    return this.materialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialesService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialesService.remove(id);
  }
}
