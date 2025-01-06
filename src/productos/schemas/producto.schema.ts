import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductoDocument = Producto & Document;

@Schema()
export class Producto {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, type: Number })
  precio: number;

  @Prop({ required: true, enum: ['Perecedero', 'No perecedero'] })
  tipo: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tienda' }] })
  tiendas: Types.ObjectId[];  
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
