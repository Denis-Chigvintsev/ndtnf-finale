import { IsString } from 'class-validator';

export class ConfirmationDto {
  @IsString()
  createdBefore: string;
}
