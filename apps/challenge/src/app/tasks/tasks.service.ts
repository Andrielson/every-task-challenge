import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly tasksMap = new Map<string, Task>();

  create(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description } = createTaskDto;
    const task = new Task(title, description, userId);
    this.tasksMap.set(task.id, task);
    return task;
  }

  findAll(userId: string) {
    return [...this.tasksMap.values()].filter((task) => task.userId === userId);
  }

  findOne(id: string, userId: string) {
    const task = this.tasksMap.get(id);
    if (!task) throw new NotFoundException();
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = this.findOne(id, userId);
    task.status = updateTaskDto.status;
    return task;
  }

  remove(id: string, userId: string) {
    this.findOne(id, userId);
    this.tasksMap.delete(id);
  }
}
