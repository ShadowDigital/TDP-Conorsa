import { 
    IsEmail, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from 'class-validator';

/**
 * DTO para el login de usuairos
 */
export class LoginUserDto {
    /* EMAIL */
    @IsString()
    @IsEmail()
    readonly email: string;

    /* PASSWORD */
    @IsString()
    /** En producción habria que habilitar esto para no permitir cualquier contraseña */
    // @MinLength(6)
    // @MaxLength(50)
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;
}
