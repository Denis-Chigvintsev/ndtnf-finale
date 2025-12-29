import { Message } from '../types/message.type';

export class CreatedSupportDto {
  id: string = '';

  authorId: string;

  author: string;

  createdAt: Date;

  messages: Message[] = [];

  isActive: boolean;
}
