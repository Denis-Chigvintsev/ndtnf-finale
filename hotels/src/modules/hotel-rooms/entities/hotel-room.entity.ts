import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class HotelRoom extends Document {
  @Prop()
  id: string = '';

  @Prop()
  hotelId: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[] = [];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isEnabled: boolean;
}
export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
