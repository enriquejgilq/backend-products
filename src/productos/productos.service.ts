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
  ) { }

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

   async addStoreToProduct(productId: string, storeId: string): Promise<Producto> {
    const producto = await this.productoModel.findById(productId);
    const tienda = await this.tiendaModel.findById(storeId);
  
    if (!producto || !tienda) {
      throw new NotFoundException('Producto o tienda no encontrado');
    }
  
     if (!/^[A-Z]{3}$/.test(tienda.ciudad)) {
      throw new BadRequestException('La ciudad debe ser un código de tres caracteres (ej. SMR, BOG, MED)');
    }
  
    const storeObjectId = new Types.ObjectId(storeId);  // Convertir el ID a ObjectId
    const productObjectId = new Types.ObjectId(productId);  // Convertir el ID a ObjectId
  
     if (!producto.tiendas.includes(storeObjectId)) {
      producto.tiendas.push(storeObjectId);  // Añadir ObjectId
    }
  
    if (!tienda.productos.includes(productObjectId)) {
      tienda.productos.push(productObjectId);  // Añadir ObjectId
    }
  
    await tienda.save();
    return producto.save();
  }
  
  async findStoresFromProduct(productId: string): Promise<Tienda[]> {
    const producto = await this.productoModel.findById(productId);
  
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
  
     if (!producto.tiendas || producto.tiendas.length === 0) {
      throw new NotFoundException('No se encontraron tiendas asociadas a este producto');
    }
  
     const tiendas = await this.tiendaModel
      .find({ '_id': { $in: producto.tiendas } })
      .exec();
  
     if (tiendas.length === 0) {
      throw new NotFoundException('No se encontraron tiendas para los ID proporcionados');
    }
  
    return tiendas;
  }


  async findStoreFromProduct(productId: string, storeId: string): Promise<Tienda> {
    const tiendas = await this.findStoresFromProduct(productId);


    const tienda = tiendas.find((store) => store._id.toString() === storeId);

    if (!tienda) {
      throw new NotFoundException('Tienda no encontrada para este producto');
    }

    return tienda;
  }

  async updateStoresFromProduct(
    productId: string,
    storeIds: string[],
  ): Promise<Producto> {
    const producto = await this.productoModel.findById(productId);

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

     const tiendas = await this.tiendaModel.find({
      '_id': { $in: storeIds.map(id => new Types.ObjectId(id)) }
    }).exec();

    if (tiendas.length !== storeIds.length) {
      throw new NotFoundException('Algunas tiendas no se encontraron');
    }

    producto.tiendas = storeIds.map(id => new Types.ObjectId(id));  
    return producto.save();
  }

  async deleteStoreFromProduct(productId: string, storeId: string): Promise<Producto> {
    const productObjectId = new Types.ObjectId(productId);
    const storeObjectId = new Types.ObjectId(storeId);

     const product = await this.productoModel.findById(productObjectId).exec();
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

     const storeIndex = product.tiendas.indexOf(storeObjectId);
    if (storeIndex === -1) {
      throw new NotFoundException(`Tienda con ID ${storeId} no está asociada al producto`);
    }

     product.tiendas.splice(storeIndex, 1);
    
     await product.save();

    return product; 
  }
 

  async delete(id: string): Promise<ProductoDocument | null> {
    const deletedProducto = await this.productoModel.findByIdAndDelete(id).exec();
    if (!deletedProducto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return deletedProducto;
  }
}
