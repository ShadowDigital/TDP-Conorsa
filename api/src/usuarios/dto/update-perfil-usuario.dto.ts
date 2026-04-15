import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateUsuarioDto } from './create-usuario.dto';

/**
 * DTO para la actualizacion del perfil de un usuario
 * Hereda los campos del DTO para la creación de usuarios, omitiendo los roles
 */
export class UpdatePerfilUsuarioDto extends PartialType(
    OmitType(CreateUsuarioDto, ['roles'] as const)
) {
}