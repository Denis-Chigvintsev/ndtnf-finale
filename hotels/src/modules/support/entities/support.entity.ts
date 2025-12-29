import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type MessageDocument = HydratedDocument<Support>;
import { Message } from '../types/message.type';

@Schema()
export class Support {
  @Prop()
  id: string = '';

  @Prop()
  author: string;

  @Prop()
  authorId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  messages: Message[];

  @Prop()
  isActive: true;

  @Prop()
  updatedAt: Date;

  @Prop()
  isEnabled: boolean;
}
export const SupportSchema = SchemaFactory.createForClass(Support);
