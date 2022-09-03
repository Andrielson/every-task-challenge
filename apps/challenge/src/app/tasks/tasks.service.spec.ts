import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus } from './entities/task-status';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

const validateTask = (
  task: Task,
  expectedUserId: string,
  expectedDescription: string,
  expectedTitle: string,
  expectedStatus = TaskStatus.TO_DO
) => {
  expect(task).toBeTruthy();
  expect(task.id).toBeTruthy();
  expect(task.id.length).toBe(36);
  expect(task.userId).toBe(expectedUserId);
  expect(task.status).toBe(expectedStatus);
  expect(task.description).toBe(expectedDescription);
  expect(task.title).toBe(expectedTitle);
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', () => {
    const userId = '1';
    const description = 'some description';
    const title = 'some title';

    const createdTask = service.create({ description, title }, userId);

    validateTask(createdTask, userId, description, title);
  });

  it('should find all tasks', () => {
    const description = 'some description';
    const title = 'some title';
    for (let n = 0; n < 10; n++) {
      service.create(
        { description: `${description} ${n}`, title: `${title} ${n}` },
        String((n % 2) + 1)
      );
    }

    const tasksFromUserOne = service.findAll('1');
    const tasksFromUserTwo = service.findAll('2');

    expect(tasksFromUserOne).toBeTruthy();
    expect(tasksFromUserOne.length).toBe(5);
    expect(tasksFromUserTwo).toBeTruthy();
    expect(tasksFromUserTwo.length).toBe(5);

    for (let i = 0; i < 5; i++) {
      validateTask(
        tasksFromUserOne[i],
        '1',
        `${description} ${2 * i}`,
        `${title} ${2 * i}`
      );
      validateTask(
        tasksFromUserTwo[i],
        '2',
        `${description} ${2 * i + 1}`,
        `${title} ${2 * i + 1}`
      );
    }
  });

  it('should find a task by id', () => {
    const userId = '1';
    const description = 'some description';
    const title = 'some title';

    const task = service.create({ description, title }, userId);
    const foundedTask = service.findOne(task.id, userId);

    validateTask(
      foundedTask,
      userId,
      task.description,
      task.title,
      task.status
    );
  });

  it('should throw ForbiddenException if a task belongs to another user', () => {
    const userId = '1';
    const description = 'some description';
    const title = 'some title';

    const task = service.create({ description, title }, userId);

    let foundedTask: Task;
    try {
      foundedTask = service.findOne(task.id, '2');
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(ForbiddenException);
      expect(foundedTask).not.toBeTruthy();
    }
  });

  it('should throw NotFoundException if a task is not found', () => {
    const userId = '1';
    const description = 'some description';
    const title = 'some title';

    service.create({ description, title }, userId);

    let foundedTask: Task;
    try {
      foundedTask = service.findOne('1', userId);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(NotFoundException);
      expect(foundedTask).not.toBeTruthy();
    }
  });

  it('should update a task status', () => {
    const userId = '1';
    const description = 'some description';
    const title = 'some title';

    const task = service.create({ description, title }, userId);
    const updatedTask = service.update(
      task.id,
      { status: TaskStatus.DONE },
      userId
    );

    validateTask(
      updatedTask,
      userId,
      task.description,
      task.title,
      TaskStatus.DONE
    );
  });
});
