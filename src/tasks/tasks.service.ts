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

  async findPaginatedTasks(page: number, sortBy?: string, searchTerm?: string) {
    const skip = 3 * page;
    let orderBy: any = [{ date: 'asc' }, { priority: 'asc' }];

    if (sortBy) {
      switch (sortBy) {
        case 'priority':
          orderBy = { priority: 'asc' };
          break;
        case 'date':
          orderBy = { date: 'asc' };
          break;
        case 'completion':
          orderBy = { completed: 'desc' };
          break;
        default:
          break;
      }
    }

    const where = searchTerm
      ? {
          description: {
            contains: searchTerm,
          },
        }
      : {};

    const pinnedTasks = await this.prisma.task.findMany({
      where: { pinned: true, ...where },
    });

    const nonPinnedTasks = await this.prisma.task.findMany({
      skip,
      take: 6 - pinnedTasks.length,
      where: { pinned: false, ...where },
      orderBy,
    });

    const tasks = [...pinnedTasks, ...nonPinnedTasks];

    const totalCount = await this.prisma.task.count({ where });
    const hasMore = skip + 6 < totalCount;
    const totalPages = Math.ceil(totalCount / 6);

    return {
      tasks: plainToInstance(TaskEntity, tasks),
      hasMore,
      totalPages,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const formattedDateData = {
      ...updateTaskDto,
      date: updateTaskDto.date ? new Date(updateTaskDto.date) : undefined,
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
