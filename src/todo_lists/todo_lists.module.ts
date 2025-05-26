import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { todoListsServiceInstance } from './todo_lists.service.instance';

@Module({
  imports: [],
  controllers: [TodoListsController],
  providers: [
    { provide: TodoListsService, useValue: todoListsServiceInstance },
  ],
})
export class TodoListsModule {}
