import { IsISO8601 } from 'class-validator';

export class GenerarInformeDto {
  @IsISO8601()
  desde: string; // YYYY-MM-DD

  @IsISO8601()
  hasta: string; // YYYY-MM-DD
}
