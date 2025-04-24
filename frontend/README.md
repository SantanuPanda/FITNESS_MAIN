# Fitness App (Frontend)

This is a standalone frontend application for the Fitness project, built with React and Vite.

## Current Status
This is now a fully client-side application. The backend has been removed, and all data operations are handled through:
- Local storage for user data persistence
- Firebase authentication for user management
- Frontend-only data handling

## Features
- User authentication and profile management
- Workout tracking
- Exercise suggestions
- Responsive UI design

## Technologies
- React
- Vite
- React Router
- Firebase Authentication
- GSAP for animations
- Tailwind CSS for styling

## Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

## Future Development
If you need to integrate with a backend API:
1. Create a new backend service
2. Update the service layer in `/src/services` to make API calls instead of using local storage
3. Configure environment variables for API endpoints 