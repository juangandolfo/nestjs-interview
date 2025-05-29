import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoListsModule } from '../src/todo_lists/todo_lists.module';

describe('TodoListsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoListsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Expect the database to be empty at the start of each test
  it('/ (GET)', () => {
    // TODO:
    //
    return request(app.getHttpServer())
      .get('/api/toDoLists')
      .expect(200)
      .expect([]);
  });

  // Try to create a to-do list with no name
  it('/ (POST) - no name', () => {
    return request(app.getHttpServer())
      .post('/api/toDoLists')
      .send({ name: '' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Name is required for creating a todo list');
      });
  });

  // Add a new to-do list
  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/toDoLists')
      .send({ name: 'List 1' })
      .expect(201)
      .expect(res => {
      expect(res.body).toEqual({
        id: 1,
        name: 'List 1',
      });
      });
  });

  // Test that the database has one item after adding a new to-do list
  it('/ (GET)', () => {
    // TODO:
    //
    return request(app.getHttpServer())
      .get('/api/toDoLists')
      .expect(200)
      .expect([{
        id: 1,
        name: 'List 1',
      }]);
  });

  // Add a second to-do list
  it('/ (POST) - second list', () => {
    return request(app.getHttpServer())
      .post('/api/toDoLists')
      .send({ name: 'List 2' })
      .expect(201)
      .expect(res => {
        expect(res.body).toEqual({
          id: 2,
          name: 'List 2',
        });
      });
  });

  // Try to create a list with the same name
  it('/ (POST) - duplicate list', () => {
    return request(app.getHttpServer())
      .post('/api/toDoLists')
      .send({ name: 'List 1' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Todo list already exists');
      });
  });

  // Check it can recieve multiple lists
  it('/ (GET) - multiple lists', () => {
    return request(app.getHttpServer())
      .get('/api/toDoLists')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBeGreaterThanOrEqual(2);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, name: 'List 1' },
          { id: 2, name: 'List 2' },
        ]));
      });
  });

  // Test Get of a single list (the last created one)
  it('/:todoListId (GET)', async () => {

        // Get the last created list
        const response = await request(app.getHttpServer())
          .get('/api/toDoLists')
          .expect(200);
        const todoListId = response.body[response.body.length - 1].id;
        return request(app.getHttpServer())
          .get(`/api/toDoLists/${todoListId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              id: todoListId,
              name: 'List 2',
            });
          });
      
  });

  // Test Update of a single list (the first one)
  it('/:todoListId (PUT)', () => {
        const todoListId = 1;
        return request(app.getHttpServer())
          .put(`/api/toDoLists/${todoListId}`)
          .send({ name: 'Updated' })
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              id: todoListId,
              name: 'Updated',
            });
          });
  });

  // Try to update a list that does not exist
  it('/:todoListId (PUT) - non-existent list', () => {
    const todoListId = 999; // Assuming this ID does not exist
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}`)
      .send({ name: 'Non-existent List' })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Todo list not found');
      });
  });

  // Try to update a list with no name
  it('/:todoListId (PUT) - no name', () => {
    const todoListId = 1;
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}`)
      .send({ name: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Name is required for updating a todo list');
      });
  });

  // Test Get of many lists
  it('/ (GET) - after update', () => {
    return request(app.getHttpServer())
      .get('/api/toDoLists')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThanOrEqual(2);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, name: 'Updated' },
          { id: 2, name: 'List 2' },
        ]));
      });
  });

  // delete the first list
  it('/:todoListId (DELETE)', () => {
    const todoListId = 1;
    return request(app.getHttpServer())
      .delete('/api/toDoLists/1')
      .expect(200);
  });

  // Try to delete a list that does not exist
  it('/:todoListId (DELETE) - non-existent list', () => {
    const todoListId = 999; // Assuming this ID does not exist
    return request(app.getHttpServer())
      .delete(`/api/toDoLists/${todoListId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Todo list not found');
      });
  });

  // Try to delete a list with no ID
  it('/:todoListId (DELETE) - no ID', () => {
    return request(app.getHttpServer())
      .delete('/api/toDoLists/')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Cannot DELETE /api/toDoLists/');
      });
  });

  // Try to delete a list with an invalid ID 
  it('/:todoListId (DELETE) - invalid ID', () => {
    return request(app.getHttpServer())
      .delete('/api/toDoLists/invalid')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Invalid todo list ID');
      });
  });

  // Test Get of many lists after deletion
  it('/ (GET) - after deletion', () => {
    return request(app.getHttpServer())
      .get('/api/toDoLists')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 2, name: 'List 2' },
        ]));
      });
  });

  // Test Get items from a list
  it('/:todoListId/items (GET)', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .get(`/api/toDoLists/${todoListId}/items/`)
      .expect(200)
      .expect([]);
  });

  // Add an item to the second list
  it('/:todoListId/items (POST)', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .post(`/api/toDoLists/${todoListId}/items`)
      .send({ description: 'Item 1' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({'id': 1,
          'todoListId': 2,
          'description': "Item 1",
          'completed': false
        });
      });
  });

  // Try to add an item with no description
  it('/:todoListId/items (POST) - no description', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .post(`/api/toDoLists/${todoListId}/items`)
      .send({ description: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Description is required for creating a todo item');
      });
  });

  // Try to add an item to a list that does not exist
  it('/:todoListId/items (POST) - non-existent list', () => {
    const todoListId = 999; // Assuming this ID does not exist
    return request(app.getHttpServer())
      .post(`/api/toDoLists/${todoListId}/items`)
      .send({ description: 'Item 1' })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe(`Todo list with ID: ${todoListId} not found`);
      });
  });

  // Test Get items from a list after adding an item
  it('/:todoListId/items (GET) - after adding item', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .get(`/api/toDoLists/${todoListId}/items/`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, description: 'Item 1', todoListId: todoListId, completed: false },
        ]));
      });
  });

  // add a second item to the second list
  it('/:todoListId/items (POST) - second item', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .post(`/api/toDoLists/${todoListId}/items`)
      .send({ description: 'Item 2' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          id: 2,
          todoListId: 2,
          description: 'Item 2',
          completed: false,
        });
      });
  });

  // Test Get items from a list after adding a second item
  it('/:todoListId/items (GET) - after adding second item', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .get(`/api/toDoLists/${todoListId}/items/`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, description: 'Item 1', todoListId: todoListId, completed: false },
          { id: 2, description: 'Item 2', todoListId: todoListId, completed: false },
        ]));
      });
  });

  // Test Update of an item in the second list
  it('/:todoListId/items/:itemId (PUT)', () => {
    const todoListId = 2;
    const itemId = 1;
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}/items/${itemId}`)
      .send({ description: 'Updated Item 1', completed: true })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          id: itemId,
          todoListId: todoListId,
          description: 'Updated Item 1',
          completed: true,
        });
      });
  });

  // Try to update an item that does not exist
  it('/:todoListId/items/:itemId (PUT) - non-existent item', () => {
    const todoListId = 2;
    const itemId = 999; // Assuming this ID does not exist
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}/items/${itemId}`)
      .send({ description: 'Non-existent Item', completed: false })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('Todo item not found');
      });
  });

  // Try to update an item with no description
  it('/:todoListId/items/:itemId (PUT) - no description', () => {
    const todoListId = 2;
    const itemId = 1;
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}/items/${itemId}`)
      .send({ description: '', completed: false })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Cannot update description to an empty string');
      });
  });

  // Test Get items from a list after updating an item
  it('/:todoListId/items (GET) - after updating item', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .get(`/api/toDoLists/${todoListId}/items/`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, description: 'Updated Item 1', todoListId: todoListId, completed: true },
          { id: 2, description: 'Item 2', todoListId: todoListId, completed: false },
        ]));
      });
  });

  // Test completed item in the second list
  it('/:todoListId/items/:itemId (Put) - completed item', () => {
    const todoListId = 2;
    const itemId = 2;
    return request(app.getHttpServer())
      .put(`/api/toDoLists/${todoListId}/items/${itemId}`)
      .send({ completed: true })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          id: itemId,
          todoListId: todoListId,
          description: 'Item 2',
          completed: true,
        });
      });
  });

  // Delete an item from the second list
  it('/:todoListId/items/:itemId (DELETE)', () => {
    const todoListId = 2;
    const itemId = 2;
    return request(app.getHttpServer())
      .delete(`/api/toDoLists/${todoListId}/items/${itemId}`)
      .expect(200);
  });

  // Test Get items from a list after deleting an item
  it('/:todoListId/items (GET) - after deleting item', () => {
    const todoListId = 2;
    return request(app.getHttpServer())
      .get(`/api/toDoLists/${todoListId}/items/`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body).toEqual(expect.arrayContaining([
          { id: 1, description: 'Updated Item 1', todoListId: todoListId, completed: true },
        ]));
      }); 
  });

  // add a new list and two items to it
  it('/ (POST) - new list with items', () => {
    return request(app.getHttpServer())
      .post('/api/toDoLists')
      .send({ name: 'List 3' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          id: 3,
          name: 'List 3',
        });
      })
      .then(() => {
        return request(app.getHttpServer())
          .post('/api/toDoLists/3/items')
          .send({ description: 'Item 1 for List 3' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 2,
              todoListId: 3,
              description: 'Item 1 for List 3',
              completed: false,
            });
          });
      })
      .then(() => {
        return request(app.getHttpServer())
          .post('/api/toDoLists/3/items')
          .send({ description: 'Item 2 for List 3' })
          .expect(201)
          .expect((res) => {
            expect(res.body).toEqual({
              id: 3,
              todoListId: 3,
              description: 'Item 2 for List 3',
              completed: false,
            });
          });
      });
  });

  // Delete the new list with items and check the items are also deleted
  it('/:todoListId (DELETE) - new list with items', () => {
    const todoListId = 3;
    return request(app.getHttpServer())
      .delete(`/api/toDoLists/${todoListId}`)
      .expect(200)
      .then(() => {
        return request(app.getHttpServer())
          .get(`/api/toDoLists/${todoListId}/items/`)
          .expect(404); // Expecting 404 because the list should be deleted
      });
  });

  

  

  


    
    // test cases above this line
});


