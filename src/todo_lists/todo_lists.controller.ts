import {
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

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    return this.todoListsService.all();
  }

  @Get('/:todoListId')
  show(@Param() param: { todoListId: number }): TodoList {
    return this.todoListsService.get(param.todoListId);
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    return this.todoListsService.create(dto);
  }
  
  @Put('/:todoListId')
  update(
    @Param() param: { todoListId: number },
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    return this.todoListsService.update(param.todoListId, dto);
  }
  
  @Delete('/:todoListId')
  delete(@Param() param: { todoListId: number }): void {
    this.todoListsService.delete(param.todoListId);
  }
  
  @Get('/:todoListId/items')
  indexItems(
    @Param() param: { todoListId: number }
  ): TodoItem[] {
    return this.todoListsService.allItems(param.todoListId);
  }

  @Post('/:todoListId/items')
  addItem(
    @Param() param: { todoListId: number },
    @Body() dto: CreateTodoItemDto,
  ): TodoItem {
    return this.todoListsService.addItem(param.todoListId, dto);
  } 
  
  @Put('/:todoListId/items/:todoItemId')
  updateItem(
    @Param() param: { todoListId: number; todoItemId: number },
    @Body() dto: Partial<UpdateTodoItemDto>,
  ): TodoItem {
    return this.todoListsService.updateItem(
      param.todoListId,
      param.todoItemId,
      dto,
    );
  }

  @Delete('/:todoListId/items/:todoItemId')
  deleteItem(
    @Param() param: { todoListId: number; todoItemId: number },
  ): void {
    this.todoListsService.deleteItem(param.todoListId, param.todoItemId);
  }

}
