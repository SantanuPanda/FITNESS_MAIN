# Deploying to Render

This guide covers how to deploy the Fitness API backend to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Create a New Web Service

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Navigate to the repository containing your backend code

### 2. Configure the Web Service

Fill in the following details:
- **Name**: fitness-backend (or any name you prefer)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or choose an appropriate plan)

### 3. Add Environment Variables

Under the "Environment" tab, add the following variables:
- `NODE_ENV`: production
- `MONGODB_URI`: mongodb+srv://ADMIN:Dyi5HSNTHNdiV0QD@test.doecbiu.mongodb.net/fitness
- `JWT_SECRET`: fitness_secret_key_123 (or use a more secure random string)

### 4. Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Troubleshooting

If you encounter the "bash: line 1: n: command not found" error:
1. Ensure your package.json has the proper configuration (Node.js version, scripts)
2. Use the default build command: `npm install`
3. Ensure you have a build script in package.json: `"build": "echo 'Build completed'"`

## MongoDB Atlas Configuration

To ensure your Render deployment can connect to MongoDB Atlas:

1. Log in to MongoDB Atlas
2. Go to Network Access in the Security section
3. Add a new IP address: 0.0.0.0/0 (allows connections from anywhere)
4. Save the configuration

## Testing the Deployment

Once deployed, you can verify your API is working by accessing:
```
https://your-app-name.onrender.com/
```

You should see the message: "Fitness API is running..." 