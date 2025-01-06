import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateTiendaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., "SMR", "BOG")' })
  ciudad?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
