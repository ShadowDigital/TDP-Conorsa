import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../usuarios/entities/usuario.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:(configSRVC: ConfigService) => {
                return {
                    secret: configSRVC.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '2h'
                    }
                }
            }
        })
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy
    ],
    exports:[
        JwtStrategy,
        PassportModule,
        JwtModule
    ]
})
export class AuthModule {}
