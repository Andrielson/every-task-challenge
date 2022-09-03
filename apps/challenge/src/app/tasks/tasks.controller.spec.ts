import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './entities/task-status';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const createTaskDto: CreateTaskDto = {
  description: 'Some Description',
  title: 'Some Title',
};
const fakeRequest: Pick<Request, 'user'> = { user: { id: '1' } };

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', () => {
    const task = controller.create(createTaskDto, fakeRequest as Request);
    expect(task).toBeTruthy();
  });

  it('should findAll', () => {
    controller.create(createTaskDto, fakeRequest as Request);
    const tasks = controller.findAll(fakeRequest as Request);
    expect(tasks).toBeTruthy();
    expect(tasks.length).toBe(1);
  });

  it('should findOne', () => {
    const createdTask = controller.create(
      createTaskDto,
      fakeRequest as Request
    );
    const task = controller.findOne(createdTask.id, fakeRequest as Request);
    expect(task).toBeTruthy();
    expect(task).toEqual(createdTask);
  });

  it('should update', () => {
    const createdTask = {
      ...controller.create(createTaskDto, fakeRequest as Request),
    };
    const updatedTask = controller.update(
      createdTask.id,
      { status: TaskStatus.ARCHIVED },
      fakeRequest as Request
    );
    expect(updatedTask).toBeTruthy();
    expect(updatedTask.status).not.toBe(createdTask.status);
  });
});
