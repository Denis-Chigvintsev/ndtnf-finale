export class CreateSupportDto {
  id?: string = '';

  author?: string;

  authorId?: string;

  createdAt?: Date;

  text: string;

  isActive?: boolean;
}
