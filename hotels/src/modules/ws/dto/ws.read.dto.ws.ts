import { IsString } from 'class-validator';

export class ReadDto {
  @IsString()
  messageNumber: string;
  @IsString()
  reqid: string;
}
