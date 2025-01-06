import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsEnum(['Perecedero', 'No perecedero'])
  tipo: string;
}
