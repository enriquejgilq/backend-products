import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Producto, ProductoDocument } from './schemas/producto.schema';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Tienda, TiendaDocument } from '../tiendas/schemas/tienda.schema';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private productoModel: Model<ProductoDocument>,
    @InjectModel(Tienda.name) private tiendaModel: Model<TiendaDocument>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const createdProducto = new this.productoModel(createProductoDto);
    return createdProducto.save();
  }

  async findAll(): Promise<Producto[]> {
    return this.productoModel.find().exec();
  }

  async findOne(id: string): Promise<Producto> {
    return this.productoModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.productoModel
      .findByIdAndUpdate(id, updateProductoDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Producto> {
    return this.productoModel.findByIdAndDelete(id).exec();
  }

  // Método para asociar una tienda a un producto
  async addStoreToProduct(productId: string, storeId: string): Promise<Producto> {
    const producto = await this.productoModel.findById(productId);
    const tienda = await this.tiendaModel.findById(storeId);

    if (!producto || !tienda) {
      throw new NotFoundException('Producto o tienda no encontrado');
    }

    // Validar que la ciudad de la tienda tiene un código de tres caracteres
    if (!/^[A-Z]{3}$/.test(tienda.ciudad)) {
      throw new BadRequestException('La ciudad debe ser un código de tres caracteres (ej. SMR, BOG, MED)');
    }

    const storeObjectId = new Types.ObjectId(storeId);
    const productObjectId = new Types.ObjectId(productId);

    // Asociar tienda al producto y producto a la tienda
    if (!producto.tiendas.includes(storeObjectId)) {
      producto.tiendas.push(storeObjectId);
    }

    if (!tienda.productos.includes(productObjectId)) {
      tienda.productos.push(productObjectId);
    }

    await tienda.save();
    return producto.save();
  }

  async findStoresFromProduct(productId: string): Promise<TiendaDocument[]> {
    const producto = await this.productoModel
      .findById(productId)
      .populate<{ tiendas: TiendaDocument[] }>('tiendas')  
      .exec();
  
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
  
    return producto.tiendas;  
  }
  
  async findStoreFromProduct(productId: string, storeId: string): Promise<Tienda> {
    const tiendas = await this.findStoresFromProduct(productId);   
  
    
    const tienda = tiendas.find((store) => store._id.toString() === storeId);
  
    if (!tienda) {
      throw new NotFoundException('Tienda no encontrada para este producto');
    }
  
    return tienda;
  }
  
  // Método para actualizar las tiendas asociadas a un producto
  async updateStoresFromProduct(
    productId: string,
    storeIds: string[],
  ): Promise<Producto> {
    const producto = await this.productoModel.findById(productId);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar si las tiendas proporcionadas existen
    const tiendas = await this.tiendaModel.find({
      '_id': { $in: storeIds.map(id => new Types.ObjectId(id)) }
    }).exec();

    if (tiendas.length !== storeIds.length) {
      throw new NotFoundException('Algunas tiendas no se encontraron');
    }

    producto.tiendas = storeIds.map(id => new Types.ObjectId(id)); // Asignar las nuevas tiendas al producto
    return producto.save();
  }

  // Método para eliminar una tienda asociada a un producto
  async deleteStoreFromProduct(productId: string, storeId: string): Promise<Producto> {
    const producto = await this.productoModel.findById(productId);
    const tienda = await this.tiendaModel.findById(storeId);

    if (!producto || !tienda) {
      throw new NotFoundException('Producto o tienda no encontrado');
    }

    // Eliminar la tienda del producto
    producto.tiendas = producto.tiendas.filter((id) => id.toString() !== storeId);

    // Eliminar el producto de la tienda
    tienda.productos = tienda.productos.filter((id) => id.toString() !== productId);

    await tienda.save();
    return producto.save();
  }

  async delete(id: string): Promise<ProductoDocument | null> {
    const deletedProducto = await this.productoModel.findByIdAndDelete(id).exec();
    if (!deletedProducto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return deletedProducto;
  }



}
