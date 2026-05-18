import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Productos')
// @ApiBearerAuth()
@Controller('productos')
// @UseGuards(AuthGuard())
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
}
