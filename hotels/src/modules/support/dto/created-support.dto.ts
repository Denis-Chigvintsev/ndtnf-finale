import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Message } from '../types/message.type';

export class CreatedSupportDto {
  @IsOptional()
  @IsString()
  id: string = '';

  @IsOptional()
  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @ValidateNested()
  messages: Message[] = [];

  @IsBoolean()
  isActive: boolean;
}
