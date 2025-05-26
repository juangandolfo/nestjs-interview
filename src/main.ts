import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


import { server as mcpServer } from './todo_lists/MCP_server';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { create } from 'domain';

async function bootstrap() {
  // Iniciar servidor NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3002);

  // Iniciar servidor MCP
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  // console.log("MCP server connected (via stdio)");
  
}

bootstrap();
