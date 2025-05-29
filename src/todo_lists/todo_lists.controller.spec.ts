import { Test, TestingModule } from '@nestjs/testing';
import { before } from 'node:test';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  // Index test cases
  // valid
  describe('index', () => {
    it('should return the list of todolist', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ]);
    });
  });

  // Show  - test cases
  // 1 - valid
  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual({
        id: 1,
        name: 'test1',
      });
    });
  });

  // 2 - Fail over invalid id
  describe('show with invalid id', () => {
    it('should throw an error when trying to get a todolist with an invalid id', () => {
      expect(() => todoListsController.show({ todoListId: 4 })).toThrow(
        'Todo list not found',
      );
    });
  });

  // 3 - Fail over invalid id type
  describe('show with invalid id type', () => {
    it('should throw an error when trying to get a todolist with an invalid id type', () => {
      expect(() => todoListsController.show({ todoListId: NaN })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // 4 - Fail over empty id
  describe('show with empty id', () => {
    it('should throw an error when trying to get a todolist with an empty id', () => {
      expect(() => todoListsController.show({ todoListId: undefined })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // 5 - Fail over null id
  describe('show with null id', () => {
    it('should throw an error when trying to get a todolist with a null id', () => {
      expect(() => todoListsController.show({ todoListId: null })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // update - test cases
  // 1 - valid
  describe('update', () => {
    it('should update the todolist with the given id', () => {
      expect(
        todoListsController.update({ todoListId: 1 }, { name: 'modified' }),
      ).toEqual({ id: 1, name: 'modified' });

      expect(todoListService.get(1).name).toEqual('modified');
    });
  });

  // 2 - Fail over invalid id
  describe('update with invalid id', () => {
    it('should throw an error when trying to update a todolist with an invalid id', () => {
      expect(() =>
        todoListsController.update({ todoListId: 4 }, { name: 'modified' }),
      ).toThrow('Todo list not found');
    });
  });

  // 3 - Fail over invalid id type
  describe('update with invalid id type', () => {
    it('should throw an error when trying to update a todolist with an invalid id type', () => {
      expect(() =>
        todoListsController.update({ todoListId: NaN }, { name: 'modified' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // 4 - Fail over undefined id
  describe('update with empty id', () => {
    it('should throw an error when trying to update a todolist with an empty id', () => {
      expect(() =>
        todoListsController.update({ todoListId: undefined }, { name: 'modified' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // 5 - Fail over null id
  describe('update with null id', () => {
    it('should throw an error when trying to update a todolist with a null id', () => {
      expect(() =>
        todoListsController.update({ todoListId: null }, { name: 'modified' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // 6 - Fail over empty name
  describe('update with empty name', () => {
    it('should throw an error when trying to update a todolist with an empty name', () => {
      expect(() =>
        todoListsController.update({ todoListId: 1 }, { name: '' }),
      ).toThrow('Name is required for updating a todo list');
    });
  });

  // 7 - Fail over null name
  describe('update with null name', () => {
    it('should throw an error when trying to update a todolist with a null name', () => {
      expect(() =>
        todoListsController.update({ todoListId: 1 }, { name: null }),
      ).toThrow('Name is required for updating a todo list');
    });
  });

  // 8 - Fail over undefined name
  describe('update with undefined name', () => {
    it('should throw an error when trying to update a todolist with an undefined name', () => {
      expect(() =>
        todoListsController.update({ todoListId: 1 }, { name: undefined }),
      ).toThrow('Name is required for updating a todo list');
    });
  });

  // 9 - Fail over duplicate name
  describe('update with duplicate name', () => {
    it('should throw an error when trying to update a todolist with a duplicate name', () => {
      expect(() =>
        todoListsController.update({ todoListId: 1 }, { name: 'test2' }),
      ).toThrow('Todo list already exists');
    });
  });

  // Create - test cases
  // valid
  describe('create', () => {
    it('should update the todolist with the given id', () => {
      expect(todoListsController.create({ name: 'new' })).toEqual({
        id: 3,
        name: 'new',
      });

      expect(todoListService.all().length).toBe(3);
    });
  });
  
  // Fail over empty string name
  describe('create with empty name', () => {
    it('should throw an error when trying to create a todolist with an empty name', () => {
      expect(() => todoListsController.create({ name: '' })).toThrow(
        'Name is required for creating a todo list',
      );
    });
  });

  // Fail over undefined name
  describe('create with undefined name', () => {
    it('should throw an error when trying to create a todolist with an undefined name', () => {
      expect(() => todoListsController.create({name: undefined})).toThrow(
        'Name is required for creating a todo list',
      );
    });
  });

  // Fail over null name
  describe('create with null name', () => {
    it('should throw an error when trying to create a todolist with a null name', () => {
      expect(() => todoListsController.create({ name: null })).toThrow(
        'Name is required for creating a todo list',
      );
    });
  });

  // Fail over duplicate name
  describe('create with duplicate name', () => {
    it('should throw an error when trying to create a todolist with a duplicate name', () => {
      expect(() =>
        todoListsController.create({ name: 'test1' }),
      ).toThrow('Todo list already exists');
    });
  });

  // Delete - test cases
  // valid - no items
  describe('delete', () => {
    it('should delete the todolist with the given id', () => {
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
    });
  });

  // valid - with items
  describe('delete with items', () => {
    it('should delete the todolist with the given id and its items', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(() => todoListsController.delete({ todoListId: 1 })).not.toThrow();

      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
      expect(() => todoListService.allItems(1)).toThrow('Todo list not found');
    });
  });

  // delete with null id
  describe('delete with null id', () => {
    it('should throw an error when trying to delete a todolist with a null id', () => {
      expect(() => todoListsController.delete({ todoListId: null })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // delete with invalid id type
  describe('delete with invalid id type', () => {
    it('should throw an error when trying to delete a todolist with an invalid id type', () => {
      expect(() => todoListsController.delete({ todoListId: NaN })).toThrow(
        'Invalid todo list ID',
      );
    });
  });
  
  // delete with undefined id
  describe('delete with undefined id', () => {
    it('should throw an error when trying to delete a todolist with an empty id', () => {
      expect(() => todoListsController.delete({ todoListId: undefined })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // delete with invalid id
  describe('delete with invalid id', () => {
    it('should throw an error when trying to delete a todolist with an invalid id', () => {
      expect(() => todoListsController.delete({ todoListId: 4 })).toThrow(
        'Todo list not found',
      );
    });
  });

  // addItem - test cases
  // valid REVISAR
  describe('addItem', () => {
    it('should add an item to the todolist with the given id', () => {
      expect(
        todoListsController.addItem(
          { todoListId: 1 },
          { description: 'new item' },
        ),
      ).toEqual({
        id: 1,
        description: 'new item',
        completed: false,
        todoListId: 1,
      });

      expect(todoListService.allItems(1).length).toBe(1);
    });
  });

  // addItem with null id
  describe('addItem with null id', () => {
    it('should throw an error when trying to add an item to a todolist with a null id', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: null }, { description: 'new item' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // addItem with invalid id type
  describe('addItem with invalid id type', () => {
    it('should throw an error when trying to add an item to a todolist with an invalid id type', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: NaN }, { description: 'new item' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // addItem with undefined id
  describe('addItem with undefined id', () => {
    it('should throw an error when trying to add an item to a todolist with an empty id', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: undefined }, { description: 'new item' }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // addItem with invalid todoListId
  describe('addItem with invalid todoListId', () => {
    it('should throw an error when trying to add an item to a todolist with an invalid todoListId', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: 4 }, { description: 'new item' }),
      ).toThrow('Todo list with ID: 4 not found');
    });
  });

  // addItem with empty description
  describe('addItem with empty description', () => {
    it('should throw an error when trying to add an item with an empty description', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: 1 }, { description: '' }),
      ).toThrow('Description is required for creating a todo item');
    });
  });

  // addItem with undefined description
  describe('addItem with undefined description', () => {
    it('should throw an error when trying to add an item with an undefined description', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: 1 }, { description: undefined }),
      ).toThrow('Description is required for creating a todo item');
    });
  });

  // addItem with null description
  describe('addItem with null description', () => {
    it('should throw an error when trying to add an item with a null description', () => {
      expect(() =>
        todoListsController.addItem({ todoListId: 1 }, { description: null }),
      ).toThrow('Description is required for creating a todo item');
    });
  });

  // allItems - test cases
  // valid - one item
  describe('indexItems', () => {
    it('should return the list of items for the given todolist', () => {
      // Add an item before running the test
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });

      expect(todoListsController.indexItems({ todoListId: 1 })).toEqual([
        {
          id: 1,
          description: 'item 1',
          completed: false,
          todoListId: 1,
        },
      ]);
    });
  });

  // valid - multiple items
  describe('indexItems with multiple items', () => {
    it('should return the list of items for the given todolist', () => {
      // Add multiple items before running the test
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 2' });
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 3' });

      expect(todoListsController.indexItems({ todoListId: 1 })).toEqual([
        {
          id: 1,
          description: 'item 1',
          completed: false,
          todoListId: 1,
        },
        {
          id: 2,
          description: 'item 2',
          completed: false,
          todoListId: 1,
        },
        {
          id: 3,
          description: 'item 3',
          completed: false,
          todoListId: 1,
        },
      ]);
    });
  });

  // valid - no items
  describe('indexItems with no items', () => {
    it('should return an empty list when there are no items in the todolist', () => {
      expect(todoListsController.indexItems({ todoListId: 1 })).toEqual([]);
    });
  });

  // indexItems with null id
  describe('indexItems with null id', () => {
    it('should throw an error when trying to get items from a todolist with a null id', () => {
      expect(() => todoListsController.indexItems({ todoListId: null })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // indexItems with invalid id type
  describe('indexItems with invalid id type', () => {
    it('should throw an error when trying to get items from a todolist with an invalid id type', () => {
      expect(() => todoListsController.indexItems({ todoListId: NaN })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // indexItems with undefined id
  describe('indexItems with undefined id', () => {
    it('should throw an error when trying to get items from a todolist with an empty id', () => {
      expect(() => todoListsController.indexItems({ todoListId: undefined })).toThrow(
        'Invalid todo list ID',
      );
    });
  });

  // indexItems with invalid todoListId
  describe('indexItems with invalid todoListId', () => {
    it('should throw an error when trying to get items from a todolist with an invalid todoListId', () => {
      expect(() => todoListsController.indexItems({ todoListId: 4 })).toThrow(
        'Todo list not found',
      );
    });
  });

  // Update items - test cases
  // valid - only description is updated
  describe('updateItem', () => {
    it('should update the item with the given id', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: 1 },
          { description: 'updated item' },
        ),
      ).toEqual({
        id: 1,
        description: 'updated item',
        completed: false,
        todoListId: 1,
      });

      expect(todoListService.allItems(1)[0].description).toEqual('updated item');
    });
  });

  // valid - only completed is updated
  describe('updateItem with completed status', () => {
    it('should update the item completed status', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: 1 },
          { completed: true },
        ),
      ).toEqual({
        id: 1,
        description: 'item 1',
        completed: true,
        todoListId: 1,
      });

      expect(todoListService.allItems(1)[0].completed).toBe(true);
    });
  });

  // valid - both description and completed are updated
  describe('updateItem with description and completed status', () => {
    it('should update the item with the given id', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: 1 },
          { description: 'updated item', completed: true },
        ),
      ).toEqual({
        id: 1,
        description: 'updated item',
        completed: true,
        todoListId: 1,
      });

      const updatedItem = todoListService.allItems(1)[0];
      expect(updatedItem.description).toEqual('updated item');
      expect(updatedItem.completed).toBe(true);
    });
  });

  // valid - no updates
  describe('updateItem with no updates', () => {
    it('should return the item without making any changes', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: 1 },
          {},
        ),
      ).toEqual({
        id: 1,
        description: 'item 1',
        completed: false,
        todoListId: 1,
      });

      const item = todoListService.allItems(1)[0];
      expect(item.description).toEqual('item 1');
      expect(item.completed).toBe(false);
    });
  });

  // updateItem with null todoListId
  describe('updateItem with null todoListId', () => {
    it('should throw an error when trying to update an item with a null todoListId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: null, todoItemId: 1 },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo list ID');
    });
  });

  // updateItem with invalid todoListId type
  describe('updateItem with invalid todoListId type', () => {
    it('should throw an error when trying to update an item with an invalid todoListId type', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: NaN, todoItemId: 1 },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo list ID');
    });
  });

  // updateItem with undefined todoListId
  describe('updateItem with undefined todoListId', () => {
    it('should throw an error when trying to update an item with an empty todoListId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: undefined, todoItemId: 1 },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo list ID');
    });
  });

  // updateItem with invalid todoListId
  describe('updateItem with invalid todoListId', () => {
    it('should throw an error when trying to update an item with an invalid todoListId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: 4, todoItemId: 1 },
          { description: 'updated item' },
        ),
      ).toThrow('Todo list not found');
    });
  });

  // updateItem with null todoItemId
  describe('updateItem with null todoItemId', () => {
    it('should throw an error when trying to update an item with a null todoItemId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: null },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo item ID');
    });
  });

  // updateItem with invalid todoItemId type
  describe('updateItem with invalid todoItemId type', () => {
    it('should throw an error when trying to update an item with an invalid todoItemId type', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: NaN },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo item ID');
    });
  });

  // updateItem with undefined todoItemId
  describe('updateItem with undefined todoItemId', () => {
    it('should throw an error when trying to update an item with an empty todoItemId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: undefined },
          { description: 'updated item' },
        ),
      ).toThrow('Invalid todo item ID');
    });
  });

  // updateItem with invalid todoItemId
  describe('updateItem with invalid todoItemId', () => {
    it('should throw an error when trying to update an item with an invalid todoItemId', () => {
      expect(() =>
        todoListsController.updateItem(
          { todoListId: 1, todoItemId: 4 },
          { description: 'updated item' },
        ),
      ).toThrow('Todo item not found');
    });
  });
  
  // deleteItem - test cases
  // valid
  describe('deleteItem', () => {
    it('should delete the item with the given id', () => {
      todoListsController.addItem({ todoListId: 1 }, { description: 'item 1' });
      expect(() =>
        todoListsController.deleteItem({ todoListId: 1, todoItemId: 1 }),
      ).not.toThrow();

      expect(todoListService.allItems(1).length).toBe(0);
    });
  });

  // deleteItem with null todoListId
  describe('deleteItem with null todoListId', () => {
    it('should throw an error when trying to delete an item with a null todoListId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: null, todoItemId: 1 }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // deleteItem with invalid todoListId type
  describe('deleteItem with invalid todoListId type', () => {
    it('should throw an error when trying to delete an item with an invalid todoListId type', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: NaN, todoItemId: 1 }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // deleteItem with undefined todoListId
  describe('deleteItem with undefined todoListId', () => {
    it('should throw an error when trying to delete an item with an empty todoListId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: undefined, todoItemId: 1 }),
      ).toThrow('Invalid todo list ID');
    });
  });

  // deleteItem with invalid todoListId
  describe('deleteItem with invalid todoListId', () => {
    it('should throw an error when trying to delete an item with an invalid todoListId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: 4, todoItemId: 1 }),
      ).toThrow('Todo list not found');
    });
  });

  // deleteItem with null todoItemId
  describe('deleteItem with null todoItemId', () => {
    it('should throw an error when trying to delete an item with a null todoItemId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: 1, todoItemId: null }),
      ).toThrow('Invalid todo item ID');
    });
  });

  // deleteItem with invalid todoItemId type
  describe('deleteItem with invalid todoItemId type', () => {
    it('should throw an error when trying to delete an item with an invalid todoItemId type', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: 1, todoItemId: NaN }),
      ).toThrow('Invalid todo item ID');
    });
  });

  // deleteItem with undefined todoItemId
  describe('deleteItem with undefined todoItemId', () => {
    it('should throw an error when trying to delete an item with an empty todoItemId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: 1, todoItemId: undefined }),
      ).toThrow('Invalid todo item ID');
    });
  });

  // deleteItem with invalid todoItemId
  describe('deleteItem with invalid todoItemId', () => {
    it('should throw an error when trying to delete an item with an invalid todoItemId', () => {
      expect(() =>
        todoListsController.deleteItem({ todoListId: 1, todoItemId: 4 }),
      ).toThrow('Todo item not found');
    });
  });

  // Add more test cases as needed


  
  
  
  
  // Test must go above this line
});
