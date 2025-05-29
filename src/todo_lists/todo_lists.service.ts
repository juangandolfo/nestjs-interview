import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    if (id === undefined || id === null || isNaN(Number(id))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoList = this.todolists.find((x) => x.id === Number(id));
    if (!todoList) {
      throw new NotFoundException('Todo list not found');
    }
    return todoList;
  }

  create(dto: CreateTodoListDto): TodoList {
    if (dto.name === undefined || dto.name === null) {
      throw new BadRequestException('Name is required for creating a todo list');
    }
    if (dto.name === '') {
      throw new BadRequestException('Name is required for creating a todo list');
    }
    if (this.todolists.find((x) => x.name === dto.name)) {
      throw new BadRequestException('Todo list already exists');
    }
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    if (id === undefined || id === null || isNaN(Number(id))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (!this.todolists.find((x) => x.id === Number(id))) {
      throw new NotFoundException('Todo list not found');
    }
    if (dto.name === undefined || dto.name === null) {
      throw new BadRequestException('Name is required for updating a todo list');
    }
    if (dto.name === '') {
      throw new BadRequestException('Name is required for updating a todo list');
    }
    if (this.todolists.find((x) => x.name === dto.name)) {
      throw new BadRequestException('Todo list already exists');
    }
    const todolist = this.todolists.find((x) => x.id == Number(id));
    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    if (id === undefined || id === null || isNaN(Number(id))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    const todoList = this.todolists.find((x) => x.id === Number(id));
    if (!todoList) {
      throw new NotFoundException('Todo list not found');
    }

    // Remove all items associated with the todo list
    for (let i = this.todoItems.length - 1; i >= 0; i--) {
      if (this.todoItems[i].todoListId === Number(id)) {
        this.todoItems.splice(i, 1);
      }
    }

    // Remove the todo list
    const filtered = this.todolists.filter((x) => x.id !== Number(id));
    this.todolists.length = 0;
    this.todolists.push(...filtered);
  }

  allItems(todoListId: number): TodoItem[] {
    if (todoListId === undefined || todoListId === null || isNaN(todoListId)) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (!this.todolists.find((x) => x.id === todoListId)) {
      throw new NotFoundException('Todo list not found');
    }
    return this.todoItems.filter((x) => x.todoListId === todoListId);
  }


  addItem(
    todoListId: number, 
    dto: CreateTodoItemDto
  ): TodoItem {
    if (todoListId === undefined || todoListId === null || isNaN(Number(todoListId))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (dto.description === undefined || dto.description === null || dto.description === '') {
      throw new BadRequestException('Description is required for creating a todo item');
    }
    if (!this.todolists.find((x) => x.id === todoListId)) {
      throw new NotFoundException(`Todo list with ID: ${todoListId} not found`);
    }
    
    const todoItem: TodoItem = {
      id: this.nextItemId(),
      todoListId: Number(todoListId),
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
    if (todoListId === undefined || todoListId === null || isNaN(Number(todoListId))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (todoItemId === undefined || todoItemId === null || isNaN(Number(todoItemId))) {
      throw new BadRequestException('Invalid todo item ID');
    }
    if (!this.todolists.find((x) => x.id === todoListId)) {
      throw new NotFoundException('Todo list not found');
    }
    if(!this.todoItems.find((x) => x.id === todoItemId)) {
      throw new NotFoundException('Todo item not found');
    }
    const todoItem = this.todoItems.find((x) => x.id == Number(todoItemId));
    // Update the record when the item exists
    if (dto.description === '' || dto.description === null) {
      throw new BadRequestException('Cannot update description to an empty string');
    }
    if (dto.description !== undefined) {
      todoItem.description = dto.description;
    }
    if (dto.completed !== undefined) {
      todoItem.completed = dto.completed;
    }
    return todoItem;
  }

  deleteItem(todoListId: number, todoItemId: number): void {
    if (todoListId === undefined || todoListId === null || isNaN(Number(todoListId))) {
      throw new BadRequestException('Invalid todo list ID');
    }
    if (todoItemId === undefined || todoItemId === null || isNaN(Number(todoItemId))) {
      throw new BadRequestException('Invalid todo item ID');
    } 
    if (!this.todolists.find((x) => x.id === Number(todoListId))) {
      throw new NotFoundException('Todo list not found');
    }
    if(!this.todoItems.find((x) => x.id === Number(todoItemId))) {
      throw new NotFoundException('Todo item not found');
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
