import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialUsadoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigo_material: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre_maaterial: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unidades: string;

  @ApiProperty()
  @IsNumber()
  cantidad: number;
}

export class CreateFabricacionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigo_producto: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre_producto: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unidad: string;

  @ApiProperty()
  @IsNumber()
  cantidad: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pedido: string;

  @ApiProperty({ type: [MaterialUsadoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialUsadoDto)
  materiales: MaterialUsadoDto[];
}
