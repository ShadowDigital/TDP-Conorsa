import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { MaterialesModule } from './materiales/materiales.module';
import { ProductosModule } from './productos/productos.module';
import { FabricacionModule } from './fabricacion/fabricacion.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = {
                    type: 'mysql' as const,
                    host: configService.get<string>('DB_HOST'),
                    port: configService.get<number>('DB_PORT', 3306),
                    database: configService.get<string>('DB_NAME'),
                    username: configService.get<string>('DB_USER'),
                    password: configService.get<string>('DB_PASS'),
                    autoLoadEntities: true,
                    synchronize: false,
                };

                // console.log('--- DB CONFIG DEBUG ---');
                // console.log('Host:', dbConfig.host);
                // console.log('User:', dbConfig.username);
                // console.log('Database:', dbConfig.database);
                // console.log('-----------------------');

                return dbConfig;
            },
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
        FabricacionModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
