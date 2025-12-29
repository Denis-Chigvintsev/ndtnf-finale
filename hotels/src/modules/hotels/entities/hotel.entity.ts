import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Hotel extends Document {
  @Prop()
  id: string = '';

  @Prop()
  title: string;

  @Prop()
  description: string;
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const HotelSchema = SchemaFactory.createForClass(Hotel);
