import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    UnauthorizedException
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from './interfaces/roles';
import { User } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdatePerfilUsuarioDto } from './dto/update-perfil-usuario.dto';

@ApiTags('USUARIOS')    // Tag para Swagger
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    /**
     * Devuelve la lista de usuarios
     */
    @Get()
    @Auth(Roles.admin, Roles.tecnico)
    findAll(@Query() paginationDto: PaginationDto) {
        return this.usuariosService.findAll(paginationDto);
    }

    /**
     * Devuelve un usuario dado por su id
     */
    @Get(':id')
    @Auth(Roles.admin, Roles.tecnico)
    findOne(@Param('id', ParseUUIDPipe) id: string,) {
        return this.usuariosService.findOne(id);
    }

    /**
     * Crea un nuevo usuarioen BD
     */
    @Post()
    @Auth(Roles.admin, Roles.tecnico)
    @ApiResponse({ status: 201, description: 'Usuario Creado', type: User })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Problemas con el Token' })
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.usuariosService.create(createUsuarioDto);
    }

    /**
     * Actualiza un usuario dado por su id con los datos recibidos
     */
    @Patch(':id')
    @Auth(Roles.admin, Roles.tecnico)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUsuarioDto: UpdateUsuarioDto
    ) {
        return this.usuariosService.update(id, updateUsuarioDto);
    }

    /**
     * Elimina un usuario
     */
    @Delete(':id')
    @Auth(Roles.admin, Roles.tecnico)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.usuariosService.remove(id);
    }

    /**
     * Devuelve un usuario dado por su id si lo pide él mismo
     */
    @Get('perfil/:id')
    @Auth()
    perfil(
        @GetUser() user: User,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        // console.log(user, id);
        if (user.id !== id) {
            throw new UnauthorizedException(`No tienes permiso para acceder al recurso`);
        }

        return this.usuariosService.findOne(id);
    }

    /**
     * Actualizar perfil propio
     */
    @Patch('perfil/:id')
    @Auth()
    updatePerfil(
        @GetUser() user: User,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePerfilUsuarioDto: UpdatePerfilUsuarioDto
    ) {
        if (user.id !== id) {
            throw new UnauthorizedException(`No tienes permiso para acceder al recurso`);
        }

        return this.usuariosService.updatePerfil(id, updatePerfilUsuarioDto);
    }
}
