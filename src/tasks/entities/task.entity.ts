import { Priority, Task } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

export class TaskEntity implements Task {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  })
  date: Date;

  @Expose()
  priority: Priority;

  @Expose()
  completed: boolean;

  @Expose()
  pinned: boolean;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
}
