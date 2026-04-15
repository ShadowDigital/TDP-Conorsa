import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

/**
 * DTO para paginación de resultados
 */

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number )
    limit?: number;
    
    
    @IsOptional()
    @Min(0)
    @Type(() => Number )
    offset?: number;
}
