import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateSupportDto {
  @IsOptional()
  @IsString()
  id?: string = '';

  @IsString()
  @IsOptional()
  author?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
