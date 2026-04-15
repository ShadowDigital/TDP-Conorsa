import { 
    IsArray, 
    IsEmail, 
    IsOptional, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from "class-validator";

import { Roles } from "../interfaces/roles";

/**
 * DTO para la creación de Usuarios
 */
export class CreateUsuarioDto {
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

    /* ROLES */
    @IsArray()
    @IsOptional()
    readonly roles?: Roles[] = [Roles.tecnico];
}
