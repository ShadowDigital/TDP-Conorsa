import { 
    createParamDecorator, 
    ExecutionContext, 
    InternalServerErrorException 
} from "@nestjs/common";

/**
 * Decorador de parámetro para obtener el usuario de la Request
 * Si pasó por la autenticación (AuthGuard()/JwtStrategy) el usuario estará en la Request
 * Si no, no existirá el usuario
 * 'data' me dice qué dato del usuario quiero devolver, si está vacio se devuelven todos los campos
 */
export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        // La Request sale del Contexto
        const req = ctx.switchToHttp().getRequest();
        // Obtener el usuario de la Request
        const user = req.user;

        // Si no existe el usuario devuelve un error
        if(!user) {
            throw new InternalServerErrorException('User not found in request');
        }

        return data ? user[data] : user;
    }
);
