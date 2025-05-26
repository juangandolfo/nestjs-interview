import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];
  private readonly todoItems: TodoItem[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
    this.todoItems = []; // Initialize with an empty array 
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    return this.todolists.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoListDto): TodoList {
    // Dont allow duplicate todo list names
    if (this.todolists.find((x) => x.name === dto.name)) {
      throw new Error('Todo list already exists');
    }
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    // Dont allow duplicates todo list names
    if (this.todolists.find((x) => x.name === dto.name)) {
      throw new Error('Todo list already exists');
    }
    const todolist = this.todolists.find((x) => x.id == Number(id));
    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));
    // Check if the todoListId exists
    if (this.todolists.find((x) => x.id === id)) {
      throw new Error('Todo list not found');
    }
    
    // Delete items associated with the todo list
    this.todoItems.splice(this.todoItems.findIndex((x) => x.todoListId === id))

    // Delete the todo list
    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  allItems(todoListId: number): TodoItem[] {
    // Check if the todoListId exists
    if (this.todolists.find((x) => x.id === todoListId)) {
      throw new Error('Todo list not found');
    }
    return this.todoItems.filter((x) => x.todoListId === todoListId);
  }

  addItem(
    todoListId: number, 
    dto: CreateTodoItemDto
  ): TodoItem {
    // Check if the todoListId exists
    if (this.todolists.find((x) => x.id === todoListId)) {
      throw new Error('Todo list not found');
    }
    const todoItem: TodoItem = {
      id: this.nextItemId(),
      todoListId: todoListId,
      description: dto.description, //agregar string vacio cuando no se recibe nada?
      completed: false,
    };

    this.todoItems.push(todoItem);

    return todoItem;
  }

  updateItem(
    todoListId: number,
    todoItemId: number,
    dto: Partial<UpdateTodoItemDto>,
  ): TodoItem {
    // Check if the todoListId exists
    if (this.todolists.find((x) => x.id === todoListId)) {
      throw new NotFoundException('Todo list not found');
    }
    // Check if the todoItemId exists
    if(this.todoItems.find((x) => x.id === todoItemId)) {
      throw new NotFoundException('Todo item not found');
    }
    const todoItem = this.todoItems.find((x) => x.id == Number(todoItemId));
    // Update the record when the item exists
    if (dto.description !== undefined) {
      todoItem.description = dto.description;
    }
    if (dto.completed !== undefined) {
      todoItem.completed = dto.completed;
    }
    return todoItem;
  }

  deleteItem(todoListId: number, todoItemId: number): void {
    // Check if the todoListId exists
    if (!this.todolists.findIndex((x) => x.id === todoListId)) {
      throw new Error('Todo list not found');
    }
    // Check if the todoItemId exists
    if(this.todoItems.find((x) => x.id === todoItemId)) {
      throw new Error('Todo item not found');
    }
    const index = this.todoItems.findIndex((x) => x.id == Number(todoItemId));

    if (index > -1) {
      this.todoItems.splice(index, 1);
    }
  }

  // Wont modify as it works for this application
  private nextId(): number {
    const last = this.todolists 
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
  private nextItemId(): number {
    const last = this.todoItems 
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
