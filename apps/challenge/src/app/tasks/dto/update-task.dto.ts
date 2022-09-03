import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task-status';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
