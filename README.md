# TheGoGame - Task Management Application

A full-stack task management application with web and mobile interfaces.

## Features

- Create, edit, and delete task items
- Mark tasks as complete
- Multi-user support with authentication
- Cross-platform compatibility (iOS, Android, Web)
- Real-time updates
- Session-based authentication

## Tech Stack

- **Frontend**: React Native with TypeScript, React with TypeScript
- **Backend**: Node.js with Express, Prisma
- **Database**: MongoDB, SQLite
- **Authentication**: Session-based with express-session

## Project Structure

```
TheGoGame/
├── backend/         # Node.js + Express + Prisma backend
├── web/            # React + TypeScript web frontend
└── mobile/         # React Native mobile app
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Android Studio (for mobile development)
- Expo CLI (for mobile development)
- MongoDB
- React Native development environment
- Yarn or npm

## Setting Up the Development Environment

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will run on http://localhost:5000

### Web Frontend Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The web app will run on http://localhost:3000

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on Android:
   - Press 'a' in the terminal to run on Android emulator
   - Or scan the QR code with Expo Go app on your physical device

## Default Login Credentials

For testing purposes, you can use these default credentials:
- Username: Test123
- Password: Test123!

## API Endpoints

### Authentication
- POST /auth/register - Register a new user
- POST /auth/login - Login user
- GET /auth/verify - Verify token

### Todo Management
- GET /todos - Get all todos
- POST /todos - Create a new todo
- PUT /todos/:id - Update a todo
- DELETE /todos/:id - Delete a todo

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

## Additional Notes

- The backend uses SQLite for development. For production, consider using PostgreSQL.
- The mobile app uses AsyncStorage for token management.
- The web app uses localStorage for token management.

## License

MIT
