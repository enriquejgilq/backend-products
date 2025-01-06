import { Controller, Post, Param, Body, Get, Put, Delete,NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post(':productId/tiendas/:storeId')
  addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productosService.addStoreToProduct(productId, storeId);
  }

  @Get(':productId/tiendas')
  findStoresFromProduct(@Param('productId') productId: string) {
    return this.productosService.findStoresFromProduct(productId);
  }

  @Get(':productId/tiendas/:storeId')
  findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productosService.findStoreFromProduct(productId, storeId);
  }

  @Put(':productId/tiendas')
  updateStoresFromProduct(
    @Param('productId') productId: string,
    @Body() storeIds: string[],
  ) {
    return this.productosService.updateStoresFromProduct(productId, storeIds);
  }

  @Delete(':productId/tiendas/:storeId')
  deleteStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productosService.deleteStoreFromProduct(productId, storeId);
  }

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }
  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const producto = await this.productosService.findOne(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }


  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    const updatedProducto = await this.productosService.update(
      id,
      updateProductoDto,
    );
    if (!updatedProducto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return updatedProducto;
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.productosService.delete(id);
    if (!result) {
      throw new NotFoundException('Producto no encontrado');
    }
    return { message: 'Producto eliminado correctamente' };
  }
}
