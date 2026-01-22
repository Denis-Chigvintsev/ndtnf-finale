import { IsString } from 'class-validator';

export class MessageDto {
  //authorId: string;
  //author?: string;
  //sentAt?: Date;
  @IsString()
  text: string;
  //readAt?: Date;
}
