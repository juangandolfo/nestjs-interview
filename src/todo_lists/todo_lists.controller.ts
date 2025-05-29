import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoListsService } from './todo_lists.service';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';

@Controller('api/toDoLists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  show(@Param() param: { todoListId: string }): TodoList {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoListId = Number(param.todoListId);
    return this.todoListsService.get(todoListId);
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    return this.todoListsService.create(dto);
  }
  
  @Put('/:todoListId')
  update(
    @Param() param: { todoListId: string },
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoListId = Number(param.todoListId);
    return this.todoListsService.update(todoListId, dto);
  }
  
  @Delete('/:todoListId')
  delete(@Param() param: { todoListId: string }): void {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoListId = Number(param.todoListId);
    this.todoListsService.delete(todoListId);
  }
  
  @Get('/:todoListId/items')
  indexItems(
    @Param() param: { todoListId: string }
  ): TodoItem[] {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoListId = Number(param.todoListId);
    return this.todoListsService.allItems(todoListId);
  }

  @Post('/:todoListId/items')
  addItem(
    @Param() param: { todoListId: string },
    @Body() dto: CreateTodoItemDto,
  ): TodoItem {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoListId = Number(param.todoListId);
    return this.todoListsService.addItem(todoListId, dto);
  } 
  
  @Put('/:todoListId/items/:todoItemId')
  updateItem(
    @Param() param: {todoListId: string; todoItemId: string },
    @Body() dto: Partial<UpdateTodoItemDto>,
  ): TodoItem {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (param.todoItemId === null) {
      throw new BadRequestException('Invalid todo item ID');
    }
    const todoListId = Number(param.todoListId);
    const todoItemId = Number(param.todoItemId);

    return this.todoListsService.updateItem(
      todoListId,
      todoItemId,
      dto,
    );
  }

  @Delete('/:todoListId/items/:todoItemId')
  deleteItem(
    @Param() param: { todoListId: string; todoItemId: string },
  ): void {
    if (param.todoListId === null) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (param.todoItemId === null) {
      throw new BadRequestException('Invalid todo item ID');
    }
    const todoListId = Number(param.todoListId);
    const todoItemId = Number(param.todoItemId);
    this.todoListsService.deleteItem(todoListId, todoItemId);
  }

}
