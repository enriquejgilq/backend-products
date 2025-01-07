import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsEnum(['Perecedero', 'No perecedero'], {
    message: 'El tipo debe ser Perecedero o No perecedero',
  })
  tipo: string;
}
