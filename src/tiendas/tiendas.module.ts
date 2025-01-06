import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TiendasService } from './tiendas.service';
import { TiendasController } from './tiendas.controller';
import { Tienda, TiendaSchema } from './schemas/tienda.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tienda.name, schema: TiendaSchema }]),
  ],
  controllers: [TiendasController],
  providers: [TiendasService],
  exports: [MongooseModule],
})
export class TiendasModule {}
