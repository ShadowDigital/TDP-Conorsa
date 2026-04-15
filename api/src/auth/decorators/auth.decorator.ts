import { AuthGuard } from "@nestjs/passport";
import { applyDecorators, UseGuards } from "@nestjs/common";

import { Roles } from "../../usuarios/interfaces/roles";
import { RoleProtected } from "./role-protected.decorator";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";

/**
 * Decorador personalizado para agrupar decoradores de autenticación y autorización
 * Recibe un array de roles válidos
 */

export function Auth(...roles: Roles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
    );
}