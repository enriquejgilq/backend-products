import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TiendaDocument = Tienda & Document;   

@Schema()
export class Tienda {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, match: /^[A-Z]{3}$/ })
  ciudad: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Producto' }] })
  productos: Types.ObjectId[];
}

export const TiendaSchema = SchemaFactory.createForClass(Tienda);
