import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

import { User } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtSrvc: JwtService
    ) { }

    /** */
    async create(createUserDto: CreateUserDto) {

        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepo.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
                created_at: new Date(),
            });

            await this.userRepo.save(user);

            return {
                ...user,
                token: this.getJwtToken({ id: user.id })
            };
        } catch (error) {
            this.handleDBExceptions(error)
        }

    }

    /** */
    async login(loginUserDto: LoginUserDto) {

        const { password, email } = loginUserDto;

        const user = await this.userRepo.findOne({
            where: { email },
            select: { email: true, password: true, id: true, roles: true }
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales no válidas');
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Credenciales no válidas');
        }

        // ********************************
        // HABRIA QUE REVISAR SI ESTÁ ACTIVO ??????

        user.password = '*****';
        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }


    /**
     * Genera un jwt a partir del payload
     * @param payload objeto que se usará para generar el token
     * @returns 
     */
    private getJwtToken(payload: JwtPayload): string {
        const token = this.jwtSrvc.sign(payload);

        return token;
    }

    /**
     * Maneja las posibles excepciones
     */
    private handleDBExceptions(error: any): never {
        this.logger.error(error);
        if ((error as { code?: string })?.code === '23505') {
            throw new BadRequestException((error as { detail?: string }).detail);
        } else if ((error as { status?: number })?.status === 400) {
            throw new BadRequestException((error as { message?: string }).message);
        }

        throw new InternalServerErrorException('Error Inesperado. Consulte al administrador.');
    }
}
