import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import * as bcrypt from 'bcrypt';

import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdatePerfilUsuarioDto } from './dto/update-perfil-usuario.dto';

@Injectable()
export class UsuariosService {
    private readonly logger = new Logger('UsuariosService');

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    /** */
    async create(createUsuarioDto: CreateUsuarioDto) {
        try {
            const { password, ...userData } = createUsuarioDto;

            const user = this.userRepo.create(
                {
                    ...userData,
                    password: bcrypt.hashSync(password, 10),
                    created_at: new Date(),
                });
            await this.userRepo.save(user);

            return user;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    /** */
    findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 0 } = paginationDto;
        const users = this.userRepo.find({
            take: limit,
            skip: offset
        });

        return users;
    }

    /** */
    async findOne(id: string) {
        const user = await this.userRepo.findOneBy({ id: id });

        if (!user) {
            throw new NotFoundException('No existe ningún Usuario con el id dado');
        }

        return user;
    }

    /** */
    async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
        const now = new Date();

        if (updateUsuarioDto.password) {
            updateUsuarioDto.password = bcrypt.hashSync(updateUsuarioDto.password, 10);
        }

        const user = await this.userRepo.preload({
            id: id,
            updated_at: now,
            ...updateUsuarioDto,
        });

        if (!user) {
            throw new NotFoundException(`No se encuentra el Usuario`);
        }

        try {
            await this.userRepo.save(user);
        } catch (error) {
            this.handleDBExceptions(error);
        }

        return user;
    }

    /** */
    async updatePerfil(id: string, updatePerfilUsuarioDto: UpdatePerfilUsuarioDto) {
        const now = new Date();

        if (updatePerfilUsuarioDto.password) {
            updatePerfilUsuarioDto.password = bcrypt.hashSync(updatePerfilUsuarioDto.password, 10);
        }

        const user = await this.userRepo.preload({
            id: id,
            updated_at: now,
            ...updatePerfilUsuarioDto,
        });

        if (!user) {
            throw new NotFoundException(`No se encuentra el Usuario`);
        }

        try {
            await this.userRepo.save(user);
        } catch (error) {
            this.handleDBExceptions(error);
        }

        return user;
    }


    /** */
    async remove(id: string) {
        const user = await this.findOne(id);
        await this.userRepo.remove(user);

        return user;
    }



    /** */
    private handleDBExceptions(error: any) {
        this.logger.error(error);
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        } else if (error.status === 400) {
            throw new BadRequestException(error.message);
        }

        throw new InternalServerErrorException('Error Inesperado. Consulte al administrador.');
    }
}
