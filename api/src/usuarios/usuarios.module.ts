import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        AuthModule
    ],
    controllers: [
        UsuariosController
    ],
    providers: [
        UsuariosService
    ],
    exports: [
        UsuariosService
    ]
})
export class UsuariosModule {}
