import { SetMetadata } from '@nestjs/common';

import { Roles } from '../../usuarios/interfaces/roles';

/**
 * Decorador personalizado para indicar los roles necesarios para acceder a una ruta protegida con el guard UserRoleGuard
 * Se utiliza una enumeracion para los nombres de roles y se convierte en vble el nombre del array de roles validos
 */

export const META_ROLES = 'roles';

// Recibe un array con los nombres de los roles válidos
export const RoleProtected = (...args: Roles[]) => {
    return SetMetadata(META_ROLES, args);
}
