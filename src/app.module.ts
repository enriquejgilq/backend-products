import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosModule } from './productos/productos.module';
import { TiendasModule } from './tiendas/tiendas.module';
 

  
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/backend-tiendas'), ProductosModule, TiendasModule, ],  
  controllers: [],
  providers: [],
})
export class AppModule { }
 
