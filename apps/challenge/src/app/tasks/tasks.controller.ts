import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.create(createTaskDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.remove(id, user.id);
  }
}
