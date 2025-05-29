# nextjs-interview / TodoApi

[![Open in Coder](https://dev.crunchloop.io/open-in-coder.svg)](https://dev.crunchloop.io/templates/fly-containers/workspace?param.Git%20Repository=git@github.com:crunchloop/nextjs-interview.git)

This is a simple Todo List API built in Nest JS and Typescript. This project is currently being used for Javascript/Typescript full-stack candidates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Check integration tests at: (https://github.com/crunchloop/interview-tests)

## Contact

- Martín Fernández (mfernandez@crunchloop.io)

## About Crunchloop

![crunchloop](https://s3.amazonaws.com/crunchloop.io/logo-blue.png)

We strongly believe in giving back :rocket:. Let's work together [`Get in touch`](https://crunchloop.io/#contact).

## How to run project

### 1 - Verify node installation
```bash
$ npm -v
```
If you don`t see the node version you should install it.
Go to [https://nodejs.org/](https://nodejs.org/) and download the **LTS** version for your operating system.  
Follow the installation instructions.
After installing you should see the version number.
### 2 - Install dependencies

```bash
npm install
```

### 3 - Option 1 - Run it and use it over http.
```bash
npm run start         # development
```
After it is possible to make requests using Postman or any other API client to interact with the endpoints.

### 4 - Option 2 - Use it with Claude
#### 4.1 - Download Claude Desktop
Go to [https://www.anthropic.com/claude/desktop](https://www.anthropic.com/claude/desktop) and download Claude Desktop for your operating system.  
Follow the installation instructions to set it up on your computer.

#### 4.2 - Modify the MCP configuration
**Locate the Claude Desktop configuration file:**
   - Open Claude Desktop.
   - Go to the **Configure** or **Developer** tab.
   - Find the option to open the configuration folder or file (usually called `claude_desktop_config.json`).

**Edit the configuration file:**
   - Add a new entry for your MCP server.  
   - Example configuration (adjust the path to your project):

```json
{
  "mcpServers": {
    "todolist": {
      "command": "node",
      "args": ["path/to/your/project/dist/main.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

#### 4.3 - Build the project
Open a terminal and navigate to your project. Then run:
```bash
npm run build
```

#### 4.4 - Open Claude dekstop 
Be sure to open claude dekstop from scratch. It is recommended to kill the claude task and then re-opening. This ensures it is being opened from scratch and it will take the MCP server configuration.

#### 4.5 - Ready to use
After completing this tasks you should be able to ask claude to create lists and tasks, edit them and delete them. 





