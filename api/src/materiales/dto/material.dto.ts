import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMaterialDto {
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

  @IsNumber()
  @IsOptional()
  coste?: number;
}

export class UpdateMaterialDto {
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

  @IsNumber()
  @IsOptional()
  coste?: number;
}
