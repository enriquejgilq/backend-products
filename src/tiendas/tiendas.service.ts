import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tienda, TiendaDocument } from './schemas/tienda.schema';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';

@Injectable()
export class TiendasService {
  constructor(
    @InjectModel(Tienda.name) private tiendaModel: Model<TiendaDocument>,
  ) {}

   async create(createTiendaDto: CreateTiendaDto): Promise<Tienda> {
     const ciudadRegex = /^[A-Z]{3}$/;
    if (!ciudadRegex.test(createTiendaDto.ciudad)) {
      throw new BadRequestException('La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., "SMR", "BOG")');
    }

    const createdTienda = new this.tiendaModel(createTiendaDto);
    return createdTienda.save();
  }

   async findAll(): Promise<Tienda[]> {
    return this.tiendaModel.find().exec();
  }
  async findOne(id: string): Promise<Tienda> {
    try {
      const tienda = await this.tiendaModel.findById(id).exec();
      if (!tienda) {
         throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
      }
      return tienda;
    } catch (error) {
      if (error.name === 'CastError') {
         throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
      }
      throw error;  
    }
  }

  async update(id: string, updateTiendaDto: UpdateTiendaDto): Promise<Tienda> {
    try {
       if (updateTiendaDto.ciudad && !/^[A-Z]{3}$/.test(updateTiendaDto.ciudad)) {
        throw new BadRequestException(
          'La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., "SMR", "BOG")',
        );
      }
  
       const tienda = await this.tiendaModel
        .findByIdAndUpdate(id, updateTiendaDto, { new: true })
        .exec();
  
      if (!tienda) {
         throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
      }
  
      return tienda;
    } catch (error) {
       if (error.name === 'CastError') {
        throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
      }
  
       throw error;
    }
  }
  

   async remove(id: string): Promise<Tienda> {
    const tienda = await this.tiendaModel.findByIdAndDelete(id).exec();
    if (!tienda) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }
    return tienda;
  }
}
