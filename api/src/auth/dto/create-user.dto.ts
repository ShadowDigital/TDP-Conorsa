import { 
    IsEmail, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from 'class-validator';

/**
 * DTO para el registro de un nuevo usuario
 */
export class CreateUserDto {
    /* NAME */
    @IsString()
    @MinLength(1)
    readonly name: string;
    
    /* EMAIL */
    @IsString()
    @IsEmail()
    readonly email: string;

    /* PASSWORD */
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}
