import { randomUUID } from 'crypto';
import { TaskStatus } from './task-status';

export class Task {
  readonly id: string;
  status: TaskStatus;

  constructor(
    readonly title: string,
    readonly description: string,
    readonly userId: string
  ) {
    this.id = randomUUID();
    this.status = TaskStatus.TO_DO;
  }
}
