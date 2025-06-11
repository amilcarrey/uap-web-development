# ToDo Backend API

A complete backend API for a ToDo application built with Express.js, TypeScript, and SQLite.

## Features

- **User Authentication**: Registration, login with JWT tokens
- **Board Management**: Create, read, update, delete boards with sharing capabilities
- **Task Management**: CRUD operations on tasks with pagination and filtering
- **User Permissions**: Board sharing with editor/viewer permissions
- **Data Validation**: Comprehensive input validation with express-validator
- **Database**: SQLite with automatic seeding
- **TypeScript**: Full type safety throughout the application

## API Endpoints

### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Boards

- `GET /api/boards` - Get all user's boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get board by ID
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/share` - Share board with another user
- `DELETE /api/boards/:id/permissions/:userId` - Remove user access
- `GET /api/boards/:id/permissions` - Get board permissions

### Tasks

- `GET /api/tasks/board/:boardId` - Get tasks from a board (with pagination)
- `POST /api/tasks/board/:boardId` - Create a task in a board
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `DELETE /api/tasks/board/:boardId/completed` - Clear completed tasks
- `GET /api/tasks/board/:boardId/counts` - Get task counts

## Authentication

All endpoints except registration and login require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Example Usage

### Register a User

```bash
curl -X POST http://localhost:4322/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### Login

```bash
curl -X POST http://localhost:4322/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }'
```

### Create a Board

```bash
curl -X POST http://localhost:4322/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "My Project",
    "description": "Project tasks"
  }'
```

### Create a Task

```bash
curl -X POST http://localhost:4322/api/tasks/board/<board-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "text": "Complete API documentation"
  }'
```

## Development

### Start the server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=4322
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Frontend Integration

This backend is designed to work with the ToDoReact frontend application. The CORS configuration allows requests from `http://localhost:5173` (default Vite dev server).

## Project Structure

```
src/
├── db/
│   └── connection.ts       # Database setup and seeding
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── request-logger.middleware.ts
│   └── validation.middleware.ts
├── modules/
│   ├── user/              # User management
│   ├── board/             # Board management
│   └── task/              # Task management
├── routes/                # API route definitions
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── index.ts              # Application entry point
```

## Features Implemented

✅ User registration and authentication  
✅ JWT token-based security  
✅ Board creation and management  
✅ Board sharing with permissions  
✅ Task CRUD operations  
✅ Task pagination and filtering  
✅ Input validation  
✅ Error handling  
✅ Request logging  
✅ Database seeding  
✅ TypeScript support  
✅ CORS configuration for frontend integration

## Database Schema

The application uses SQLite with the following tables:

- `users` - User accounts
- `boards` - ToDo boards
- `tasks` - Individual tasks
- `board_permissions` - Board sharing permissions

## Status

✅ **COMPLETED** - The backend is fully functional and ready for frontend integration.
