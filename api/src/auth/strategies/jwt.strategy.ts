import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../../usuarios/entities/usuario.entity";

/**
 * Define la estrategia de autenticación
 * Recibe un payload, extrae el id
 * Busca un usuario con ese id
 * Si no lo encuentra devuelve un error
 * Si lo encuentra comprueba que esté activo
 * Si no lo está devuelve un error
 * Si lo está añade el usuario al request
 * 
 * Lo ejecuta automaticamente AuthGuard cuando se implemente
 * Debe estar defindo como provider en auth.module
 */

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        configSrvc: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configSrvc.get('JWT_SECRET')!
        });
    }

    /** */
    async validate(payload: JwtPayload): Promise<User> {
        const { id = '***' } = payload;
        // console.log(payload);

        const user = await this.userRepo.findOneBy({id});

        if (!user) {
            throw new UnauthorizedException('Token no válido');
        }
        
        if (!user.isActive) {
            throw new UnauthorizedException('El usuario no está activo');
        }

        return user; // Se añade user al request
    }
}
