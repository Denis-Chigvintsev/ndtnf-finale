import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Reservation extends Document {
  @Prop()
  id: string = '';
  @Prop()
  userId: string;

  @Prop()
  roomId: string;
  @Prop()
  dateStart: Date;
  @Prop()
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
