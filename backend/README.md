# Fitness App Backend

A Node.js and MongoDB backend for the Fitness application. This API provides endpoints for user authentication, workout management, and nutrition tracking.

## Features

- User authentication with JWT
  - Signup and login functionality
  - Password hashing with bcrypt
  - Role-based access control
- Workout tracking (create, read, update, delete)
- Meal and nutrition tracking
- Role-based access control (user, admin, nutritionist, trainer)

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root of the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
You can use either the user routes or auth routes for authentication:

User Routes:
- POST `/api/users` - Register a new user (signup)
- POST `/api/users/login` - Login a user

Auth Routes:
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user
- GET `/api/auth/profile` - Get user profile (requires authentication)

See [Authentication Documentation](./docs/AUTH.md) for detailed usage.

### User Profile
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile

### Workouts
- GET `/api/workouts` - Get all workouts for current user
- POST `/api/workouts` - Create a new workout
- GET `/api/workouts/:id` - Get workout by ID
- PUT `/api/workouts/:id` - Update workout
- DELETE `/api/workouts/:id` - Delete workout

### Nutrition
- GET `/api/nutrition` - Get all meals for current user
- POST `/api/nutrition` - Add a new meal
- GET `/api/nutrition/:id` - Get meal by ID
- PUT `/api/nutrition/:id` - Update meal
- DELETE `/api/nutrition/:id` - Delete meal
- GET `/api/nutrition/summary` - Get nutrition summary 