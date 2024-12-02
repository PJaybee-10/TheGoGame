# TheGoGame - Task Management Application

A modern, full-stack task management application with web and mobile interfaces.

## Features

- Create, edit, and delete task items
- Mark tasks as complete
- Multi-user support with JWT authentication
- Cross-platform compatibility (iOS, Android, Web)
- Modern, responsive UI with animations
- Secure authentication with JWT tokens
- Error handling and validation
- Loading states and visual feedback

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication

### Web Frontend
- React 18
- TypeScript
- TailwindCSS for styling
- React Router v6
- Axios for API calls
- Modern UI with CSS animations

### Mobile App
- React Native
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for token management
- React Native Reanimated for animations

## Project Structure

```
TheGoGame/
├── backend/         # Node.js + Express + Prisma backend
│   ├── src/        # Source code
│   ├── prisma/     # Database schema and migrations
│   └── ...
├── web/            # React + TypeScript web frontend
│   ├── src/        
│   │   ├── screens/    # Screen components
│   │   ├── services/   # API services
│   │   └── types/      # TypeScript types
│   └── ...
└── mobile/         # React Native mobile app
    ├── src/
    │   ├── screens/    # Screen components
    │   ├── services/   # API services
    │   └── contexts/   # React contexts
    └── ...
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Android Studio (for mobile development)
- Expo CLI (for mobile development)
- React Native development environment
- Git

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
   npx prisma generate
   npx prisma migrate dev
   ```

4. Create a `.env` file with the following:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ```

5. Start the development server:
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

## Recent Updates

### Authentication Improvements
- Switched from session-based to JWT authentication
- Enhanced security with proper token management
- Added proper error handling and validation

### UI/UX Enhancements
- Redesigned login screens for both web and mobile
- Added loading states and animations
- Improved error messaging and user feedback
- Enhanced form validation and user input handling
- Added responsive design for all screen sizes

### Code Quality
- Added TypeScript types for better type safety
- Improved project structure and organization
- Enhanced error handling throughout the application
- Added proper API service layer
- Implemented React contexts for state management

## Default Login Credentials
```
Username: Test123
Password: Test123!
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
