import { PartialType } from '@nestjs/mapped-types';

import { IsBoolean, IsOptional } from 'class-validator';

import { CreateUsuarioDto } from './create-usuario.dto';

/**
 * DTO para la actualización de Usuarios
 * Hereda los campos del DTO para la creación y además añade el campo 'active'
 */
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    /* ACTIVE */
    @IsBoolean()
    @IsOptional()
    readonly isActive?: boolean;
}
