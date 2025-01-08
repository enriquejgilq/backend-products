import { 
  Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, InternalServerErrorException 
} from '@nestjs/common';
import { TiendasService } from './tiendas.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';

@Controller('/stores')
export class TiendasController {
  constructor(private readonly tiendasService: TiendasService) {}

  @Post()
  async create(@Body() createTiendaDto: CreateTiendaDto) {
    try {
      const tienda = await this.tiendasService.create(createTiendaDto);
      return { message: 'Tienda creada con éxito', tienda };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const tiendas = await this.tiendasService.findAll();
      return { message: 'Tiendas recuperadas con éxito', tiendas };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get(':id')
async findOne(@Param('id') id: string) {
  return this.tiendasService.findOne(id);
}

  

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTiendaDto: UpdateTiendaDto) {
    try {
      const tienda = await this.tiendasService.update(id, updateTiendaDto);
      return { message: 'Tienda actualizada con éxito', tienda };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const tienda = await this.tiendasService.remove(id);
      return { message: 'Tienda eliminada con éxito', tienda };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof NotFoundException) {
      return {
        error: 'Hubo un error',
        details: error.message,
      };
    } else if (error instanceof BadRequestException) {
      return {
        error: 'Hubo un error',
        details: error.message,
      };
    } else {
      return {
        error: 'Hubo un error',
        details: 'Ocurrió un error interno en el servidor',
      };
    }
  }
}
