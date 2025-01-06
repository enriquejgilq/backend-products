import { IsString, Matches } from 'class-validator';

export class CreateTiendaDto {
  @IsString()
  nombre: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., "SMR", "BOG")' })
  ciudad: string;

  @IsString()
  direccion: string;
}
