import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { todoListsServiceInstance } from "./todo_lists.service.instance";
import { TodoList } from "src/interfaces/todo_list.interface";

const server = new McpServer({
  name: "todolist",
  version: "0.0.1"
});

// Get all lists
server.tool(
  "todo_GetLists",
  "List all lists.",
  async () => {
    try {
      const lists = await todoListsServiceInstance.all();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(lists),
          }
        ]
      };
    } catch (error) {
        return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Get a specific list by name
server.tool(
  "todo_GetListByName",
  "Get a specific list by name.",
  {
    name: z.string(),
  },
  async ({ name }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === name);
      if (!list) {
        throw new Error(`List with name "${name}" not found.`);
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(list),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Create a new list
server.tool(
  "todo_CreateList",
  "Create a new list.",
  {
    name: z.string(),
  },
  async ({ name }) => {
    try {
      if (name === "") {
        throw new Error("List name cannot be empty.");
      }
      const newList: TodoList = todoListsServiceInstance.create({ name: name });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(newList),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Update an existing list
server.tool(
  "todo_UpdateList",
  "Update an existing list.",
  {
    name: z.string(),
    newName: z.string().optional(),
  },
  async ({ name, newName }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === name);
      if (!list) {
        throw new Error(`List with name "${name}" not found.`);
      }
      if (newName === "") {
        throw new Error("List name cannot be empty.");
      }
      if (newName && lists.some((l) => l.name === newName)) {
        throw new Error(`List with name "${newName}" already exists.`);
      }
      const updatedList = todoListsServiceInstance.update(list.id, { name: newName || list.name });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(updatedList),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Delete a list
server.tool(
  "todo_DeleteList",
  "Delete a list.",
  {
    name: z.string(),
  },
  async ({ name }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === name);
      if (!list) {
        throw new Error(`List with name "${name}" not found.`);
      }
      todoListsServiceInstance.delete(list.id);
      return {
        content: [
          {
            type: "text",
            text: `List "${name}" deleted successfully.`,
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Get all items from a specific list
server.tool(
  "items_GetItemsFromList",
  "List all items in a list.",
  {
    listName: z.string(),
  },
  async ({ listName }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === listName);
      if (!list) {
        throw new Error(`List with id "${listName}" not found.`);
      }
      const listId = list.id;
      const items = await todoListsServiceInstance.allItems(listId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(items),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Get information about a specific item in a list
server.tool(
  "items_GetItemInformationFromList",
  "Get information about a specific item in a list.",
  {
    list_name: z.string(),
    item_description: z.string(),
  },
  async ({ list_name, item_description }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === list_name);
      if (!list) {
        throw new Error(`List with name "${list_name}" not found.`);
      }
      const listId = list.id;
      const items = await todoListsServiceInstance.allItems(listId);
      const item = items.find((item) => item.description === item_description);
      if (!item) {
        throw new Error(`Item with description "${item_description}" not found in list "${list_name}".`);
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(item),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Create a new item in a list
server.tool(
  "items_CreateItemToList",
  "Create a new item in a list.",
  {
    list_name: z.string(),
    description: z.string(),
  },
  async ({ list_name, description }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === list_name);
      if (!list) {
        throw new Error(`List with name "${list_name}" not found.`);
      }
      const listId = list.id;
      const newItem = await todoListsServiceInstance.addItem(listId, { description: description });
      if (!newItem) {
        throw new Error(`Failed to create item in list "${list_name}".`);
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(newItem),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Update an item in a list
server.tool(
  "items_UpdateItemInList",
  "Update an item in a list.",
  {
    list_name: z.string(),
    item_description: z.string(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  },
  async ({ list_name, item_description, description, completed }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === list_name);
      if (!list) {
        throw new Error(`List with name "${list_name}" not found.`);
      }
      const listId = list.id;
      const items = await todoListsServiceInstance.allItems(listId);
      const item = items.find((item) => item.description === item_description);
      if (!item) {
        throw new Error(`Item with description "${item_description}" not found in list "${list_name}".`);
      }
      const updatedItem = await todoListsServiceInstance.updateItem(listId, item.id, { description, completed });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(updatedItem),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// Delete an item from a list
server.tool(
  "items_DeleteItemFromList",
  "Delete an item from a list.",
  {
    list_name: z.string(),
    item_description: z.string(),
  },
  async ({ list_name, item_description }) => {
    try {
      const lists = await todoListsServiceInstance.all();
      const list = lists.find((list) => list.name === list_name);
      if (!list) {
        throw new Error(`List with name "${list_name}" not found.`);
      }
      const listId = list.id;
      const items = await todoListsServiceInstance.allItems(listId);
      const item = items.find((item) => item.description === item_description);
      if (!item) {
        throw new Error(`Item with description "${item_description}" not found in list "${list_name}".`);
      }
      todoListsServiceInstance.deleteItem(listId, item.id);
      return {
        content: [
          {
            type: "text",
            text: `Item "${item_description}" deleted successfully from list "${list_name}".`,
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

// example list allready populated with some data
server.tool(
  "todo_GetExampleList",
  "Get an example list.",
  async () => {
    try {
      const exampleList = todoListsServiceInstance.create({ name: "Example List" });
      // add some example items
      await todoListsServiceInstance.addItem(exampleList.id, { description: "Example Item 1" });
      await todoListsServiceInstance.addItem(exampleList.id, { description: "Example Item 2" });
      await todoListsServiceInstance.addItem(exampleList.id, { description: "Example Item 3" });
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(exampleList),
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          }
        ]
      };
    }
  }
);

export { server };

