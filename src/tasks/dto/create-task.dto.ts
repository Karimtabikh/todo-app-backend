import { Priority } from '@prisma/client';
import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;

  @IsNotEmpty()
  @IsEnum(Priority)
  priority: Priority;
}
