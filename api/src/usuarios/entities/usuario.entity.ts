import { ApiProperty } from "@nestjs/swagger";

import { 
    BeforeInsert, 
    BeforeUpdate, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn 
} from "typeorm";

import { Roles } from "../interfaces/roles";

/**
 * Entidad par la Tabla de BD user
 */
@Entity('user')
export class User {
    /* ID PRIMARY KEY */
    @ApiProperty({
        example: '669a261a-a738-4d18-8303-8a80f1415e9a',
        description: 'ID del Usuario',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /* NAME */
    @ApiProperty({
        example: 'Jaime',
        description: 'Nombre del Usuario',
        maxLength: 30,
    })
    @Column({
        type: 'varchar',
        length: 30,
    })
    name: string;

    /* EMAIL */
    @ApiProperty({
        example: 'jaime@shadowdigital.esa',
        description: 'Email del Usuario',
        maxLength: 30,
        uniqueItems: true
    })
    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    email: string;

    /* PASSWORD */
    @ApiProperty({
        example: '*****',
        description: 'Contraseña del Usuario',
    })
    @Column({
        type: 'varchar',
        length: 200,
        select: false,
    })
    password: string;

    /* ISACTIVE */
    @ApiProperty({
        example: 'true',
        description: 'El Usuario está Activo o Deshabilitado',
        default: true
    })
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;
    
    /* ROLES */
    @ApiProperty({
        example: '[admin]',
        description: 'Roles del Usuario',
        default: [Roles.tecnico],
        
    })
    @Column({
        type: 'json',
        nullable: true,
    })
    roles: Roles[];
    
    /* CREATED_AT */
    @ApiProperty({
        example: '2026-01-09T16:13:28.432Z',
        description: 'Fecha de creación del Usuario',
        default: 'CURRENT_TIMESTAMP'
    })
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    /* UPDATED_AT */
    @ApiProperty({
        example: '2026-01-09T16:13:28.432Z',
        description: 'Fecha de actualización del Usuario',
        default: 'NULL'
    })
    @Column({
        type: 'timestamp',
        nullable: true,
        default: null,
    })
    updated_at?: Date;

    /**
     * Función que se ejecuta siempre antes de insertar un nuevo registro en la tabla
     * Limpia el email
     */
    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email?.toLowerCase().trim();
        if (!this.roles || this.roles.length === 0) {
            this.roles = [Roles.tecnico];
        }
    }

    /**
     * Función que se ejecuta siempre antes de modificar un registro en la tabla
     */
    @BeforeUpdate()
    checkFiledsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
