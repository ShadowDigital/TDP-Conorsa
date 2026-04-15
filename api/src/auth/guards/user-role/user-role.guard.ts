import { 
    BadRequestException, 
    CanActivate, 
    ExecutionContext, 
    ForbiddenException, 
    Injectable 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { Roles } from '../../../usuarios/interfaces/roles';
import { User } from '../../../usuarios/entities/usuario.entity';
import { META_ROLES } from '../../../auth/decorators/role-protected.decorator';

/**
 * Guard personalizado
 * Debe implementar CanActivate
 * Comprobará que el usuario tenga los roles necesarios
 */

@Injectable()
export class UserRoleGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Obtiene el campo dado por META_ROLES del contexto
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    // console.log({validRoles});
    // Si no se indicaron roles necesarios deja pasar (true) 
    // Se considera que no se necesita ningún rol particular
    if (!validRoles || validRoles.length === 0) return true;
    
    // Se obtiene el usuario de la Request
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
        throw new BadRequestException('User not found');
    }

    // Se comprueba que el usuario tenga el/los roles necesarios
    for (const role of user.roles) {
        if (role === Roles.superuser || validRoles.includes(role)) {
            return true;
        }
    }
    // console.log({userRoles: user.roles});

    // Si el usuario no tiene ningún rol válido se devuelve un error
    throw new ForbiddenException(
        `User ${user.name} need a valid role: [${validRoles.toString()}]`
    );
  }
}
