import { IsDate, IsOptional, IsString } from 'class-validator';

export class MessageDtoWS {
  @IsString()
  authorId: string;
  @IsOptional()
  @IsString()
  author?: string;
  @IsOptional()
  @IsDate()
  sentAt?: Date;
  @IsString()
  text: string;
  @IsDate()
  readAt?: Date;
  @IsString()
  reqid: string;
}
