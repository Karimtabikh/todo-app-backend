import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskEntity } from './entities/task.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    const transformedDto = {
      ...createTaskDto,
      date: new Date(createTaskDto.date),
    };
    return this.prisma.task.create({ data: transformedDto });
  }

  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.prisma.task.findMany({});
    return plainToInstance(TaskEntity, tasks);
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const formattedDateData = {
      ...updateTaskDto,
      date: new Date(updateTaskDto.date),
    };
    return this.prisma.task.update({
      where: {
        id,
      },
      data: formattedDateData,
    });
  }

  remove(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
