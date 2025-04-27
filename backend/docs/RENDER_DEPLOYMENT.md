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
- `PORT`: 10000
- `MONGODB_URI`: mongodb+srv://ADMIN:Dyi5HSNTHNdiV0QD@test.doecbiu.mongodb.net/fitness
- `JWT_SECRET`: fitness_secret_key_123 (or use a more secure random string)

### 4. Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Troubleshooting

### "n: command not found" error
If you encounter this error:
1. Ensure your package.json has the proper configuration (Node.js version, scripts)
2. Use the default build command: `npm install`
3. Ensure you have a build script in package.json: `"build": "echo 'Build completed'"`

### Port configuration issues
If you see "Detected service running on port 10000" but your backend isn't working:
1. Make sure your server.js is listening on the correct port (PORT env variable or 10000)
2. Verify your server is binding to all interfaces with `0.0.0.0` (not just localhost)
3. Check the Render logs for any connection errors

### CORS issues
If your frontend can't connect to your backend:
1. Make sure your backend has CORS configured correctly
2. Add your frontend URL to the allowed origins if needed

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

For more detailed status information, visit:
```
https://your-app-name.onrender.com/info
```

This will show the connection status to MongoDB, the current port, and other useful information. 