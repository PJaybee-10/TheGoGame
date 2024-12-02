# The Go Game: Todo App

A full-stack todo application built with React Native, Node.js, and MongoDB.

## Features

- Create, edit, and delete todo items
- Mark todos as complete
- Multi-user support with authentication
- Cross-platform compatibility (iOS, Android, Web)
- Real-time updates
- Session-based authentication

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: Session-based with express-session

## Project Structure

```
TheGoGame/
├── backend/           # Node.js backend server
├── mobile/           # React Native mobile app
└── web/             # React Native Web implementation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- React Native development environment
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   yarn install

   # Install mobile app dependencies
   cd ../mobile
   yarn install

   # Install web app dependencies
   cd ../web
   yarn install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   yarn start

   # Start mobile app
   cd ../mobile
   yarn start

   # Start web app
   cd ../web
   yarn start
   ```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/todos` - Get all todos for current user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## License

MIT
