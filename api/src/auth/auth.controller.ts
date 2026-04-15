import { 
    Controller, 
    Post, 
    Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')    // Tag para Swagger
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /** */
    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    /** */
    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }
}
