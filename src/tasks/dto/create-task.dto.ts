import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsNotEmpty()
  createdAt: string;

  updatedAt: string;
}
