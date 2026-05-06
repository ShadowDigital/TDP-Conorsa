import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { MaterialesModule } from './materiales/materiales.module';
import { ProductosModule } from './productos/productos.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +(process.env.DB_PORT ?? 3306),
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            autoLoadEntities: true,
            synchronize: false,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            // exclude: ['/api/v1/:any(.*)'],
        }),
        CommonModule,
        AuthModule,
        UsuariosModule,
        AsistenciaModule,
        MaterialesModule,
        ProductosModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
