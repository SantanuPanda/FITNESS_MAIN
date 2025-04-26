# Authentication Guide

This document explains how to use the authentication endpoints in the Fitness App API. 
There are two sets of authentication endpoints available: User Routes and Auth Routes.

## User Routes

### User Registration (Signup)

**Endpoint:** `POST /api/users`

Register a new user in the system.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (201 Created)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Login

**Endpoint:** `POST /api/users/login`

Authenticate an existing user and get a JWT token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (200 OK)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Auth Routes

### User Registration

**Endpoint:** `POST /api/auth/register`

Register a new user in the system.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (201 Created)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Login

**Endpoint:** `POST /api/auth/login`

Authenticate an existing user and get a JWT token.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (200 OK)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile

**Endpoint:** `GET /api/auth/profile`

Get the current user's profile.

#### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "height": 180,
  "weight": 75,
  "age": 30,
  "goals": "general_fitness",
  "profilePicture": "https://example.com/profiles/johndoe.jpg"
}
```

## Common Error Responses

- `400 Bad Request`: If validation fails
- `401 Unauthorized`: If credentials are invalid or token is missing/invalid
- `404 Not Found`: If resource doesn't exist
- `500 Internal Server Error`: If there's a server issue

## Using the Token for Authenticated Requests

For any protected endpoint, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Integration

See `backend/examples/authApiExample.js` for a complete example of how to integrate with these authentication endpoints in your frontend.

### Basic Usage

```javascript
import { signupUser, loginUser, logoutUser } from './authApiExample';

// Signup
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
};

signupUser(newUser)
  .then(data => {
    console.log('Signup successful!');
    // Redirect to dashboard or login page
  })
  .catch(error => {
    console.error('Signup failed:', error.message);
    // Display error message to user
  });

// Login
const credentials = {
  email: 'john@example.com',
  password: 'password123'
};

loginUser(credentials)
  .then(data => {
    console.log('Login successful!');
    // Redirect to dashboard
  })
  .catch(error => {
    console.error('Login failed:', error.message);
    // Display error message to user
  });

// Logout
logoutUser();
// Redirect to login page
``` 