import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialQuantityDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  unidad: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialQuantityDto)
  @IsOptional()
  materiales?: MaterialQuantityDto[];
}

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  unidad?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialQuantityDto)
  @IsOptional()
  materiales?: MaterialQuantityDto[];
}
