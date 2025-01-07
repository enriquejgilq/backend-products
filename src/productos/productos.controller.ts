import { 
  Controller, 
  Post, 
  Param, 
  Body, 
  Get, 
  Put, 
  Delete, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ObjectId } from 'mongodb';  
import { Types } from 'mongoose';

@Controller('products')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post(':productId/stores/:storeId')
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    try {
      const result = await this.productosService.addStoreToProduct(productId, storeId);
      
      return { message: 'Tienda añadida al producto con éxito', result };
    } catch (error) {
      return { 
        error: 'Hubo un error al añadir la tienda al producto', 
        details: error.message 
      };
    }
  }

  @Get(':productId/stores')
  async findStoresFromProduct(@Param('productId') productId: string) {
    try {
      const stores = await this.productosService.findStoresFromProduct(productId);
      if (!stores.length) {
        throw new NotFoundException('No se encontraron tiendas asociadas a este producto');
      }
      return stores;
    } catch (error) {
      return { 
        error: 'Hubo un error al obtener las tiendas asociadas al producto', 
        details: error.message 
      };
    }
  }

  @Get(':productId/stores/:storeId')
  async findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    try {
      const store = await this.productosService.findStoreFromProduct(productId, storeId);
      if (!store) {
        throw new NotFoundException('Tienda no encontrada para este producto');
      }
      return store;
    } catch (error) {
      return { 
        error: 'Hubo un error al obtener la tienda asociada al producto', 
        details: error.message 
      };
    }
  }

  @Put(':productId/stores')
  async updateStoresFromProduct(
    @Param('productId') productId: string,
    @Body() storeIds: string[],
  ) {
    try {
      const updatedStores = await this.productosService.updateStoresFromProduct(productId, storeIds);
      return { message: 'Tiendas actualizadas con éxito', updatedStores };
    } catch (error) {
      return { 
        error: 'Hubo un error al actualizar las tiendas', 
        details: error.message 
      };
    }
  }

  @Delete(':productId/stores/:storeId')
  async deleteStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    try {
      const result = await this.productosService.deleteStoreFromProduct(productId, storeId);
       return { message: 'Tienda eliminada del producto con éxito', result };
    } catch (error) {
      return { 
        error: 'Hubo un error al eliminar la tienda del producto', 
        details: error.message 
      };
    }
  }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    try {
      const producto = await this.productosService.create(createProductoDto);
      return { message: 'Producto creado con éxito', producto };
    } catch (error) {
      return { 
        error: 'Hubo un error al crear el producto', 
        details: error.message 
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const productos = await this.productosService.findAll();
      return productos;
    } catch (error) {
      return { 
        error: 'Hubo un error al obtener los productos', 
        details: error.message 
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        throw new NotFoundException('El ID proporcionado no es válido');
      }

      const producto = await this.productosService.findOne(id);
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      return producto;
    } catch (error) {
      return { 
        error: 'Hubo un error al obtener el producto', 
        details: error.message 
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('El ID proporcionado no es válido');
      }

      const producto = await this.productosService.findOne(id);
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      const updatedProducto = await this.productosService.update(id, updateProductoDto);
      return { message: 'Producto actualizado con éxito', updatedProducto };
    } catch (error) {
      return { 
        error: 'Error al actualizar el producto', 
        details: error.message 
      };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const result = await this.productosService.delete(id);
      if (!result) {
        throw new NotFoundException('Producto no encontrado');
      }
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      return { 
        error: 'Hubo un error al eliminar el producto', 
        details: error.message 
      };
    }
  }
}
