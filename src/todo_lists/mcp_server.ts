import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { todoListsServiceInstance } from "./todo_lists.service.instance";
import { TodoList } from "src/interfaces/todo_list.interface";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "todolist",
  version: "0.0.1"
});

server.resource(
  "toDo_listOfLists",
  "List all lists.",
  async () => {
    const lists = await todoListsServiceInstance.all();
    return {
      content: [
        {
          type: "text",
          text: lists,
        }
      ]
    };
  }
);

server.tool(
  "Create_List",
  "Create a new list.",
  {
    name: z.string(),
  },
  async ({ name }) => {
    const newList: TodoList = todoListsServiceInstance.create({ name: name });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(newList),
          
        }
      ]
    };
  }

);

// server.tool(
//   "teamtailor_get_candidate",
//   "Get a single candidate by their id.",
//   {
//     candidateId: z.number(),
//   },
//   async ({ candidateId }) => {
//     const candidate = await client.getCandidate(candidateId);

//     return {
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(candidate),
//         }
//       ]
//     }
//   }
// );

export { server };


