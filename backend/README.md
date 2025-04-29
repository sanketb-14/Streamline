# Streamline Backend

This is the backend API service for the Streamline video streaming platform. It's built with Express.js and MongoDB, using Cloudinary for media storage.

## Features

- User authentication and authorization (JWT-based)
- Google OAuth integration
- Video upload and management
- Channel management
- Comments, likes, and subscriptions
- Content recommendation algorithms
- Admin functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- Cloudinary (for video and image storage)
- JWT for authentication
- Google OAuth2

## API Routes

### Authentication Routes (`/api/v1/users`)

```
POST /register           - Register a new user
POST /login              - Login with email and password
POST /google             - Sign in with Google
GET /logout              - Logout (protected)
GET /me                  - Get current user profile (protected)
PATCH /updateMe          - Update user profile (protected)
DELETE /deleteMe         - Delete user account (protected)
GET /                    - Get all users (admin only)
```

### Channel Routes (`/api/v1/channels`)

```
GET /:channelId          - Get channel details
GET /:channelId/subscribers - Get channel subscribers
GET /name/:channelName   - Get channel by name
POST /                   - Create a new channel (protected)
POST /:channelId/subscribe - Subscribe to a channel (protected)
DELETE /:channelId/subscribe - Unsubscribe from a channel (protected)
PATCH /:channelId        - Update channel details (protected, owner only)
```

### Video Routes (`/api/v1/videos`)

```
GET /                    - Get all videos
GET /trending            - Get trending videos
GET /tags/:tag           - Get videos by tag
GET /suggestions         - Get video suggestions
GET /:videoId            - Get a specific video
GET /:videoId/comments   - Get video comments
POST /                   - Upload a new video (protected)
PATCH /:id               - Update video (protected, owner only)
DELETE /:id              - Delete video (protected, owner only)
POST /:videoId/like      - Like a video (protected)
POST /:videoId/dislike   - Dislike a video (protected)
POST /:videoId/comments  - Add a comment (protected)
DELETE /comments/:commentId - Delete a comment (protected)
POST /comments/:commentId/like - Like a comment (protected)
POST /comments/:commentId/dislike - Dislike a comment (protected)
GET /stats/overview      - Get video statistics
GET /stats/channel/:channelId - Get channel video statistics
POST /sync-channel-videos - Sync channel videos (admin only)
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=4000
NODE_ENV=development

# MongoDB
DATABASE=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/streamline
DATABASE_PASSWORD=your_mongodb_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Directory Structure

```
backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
│   ├── authController.js
│   ├── channelController.js
│   ├── userController.js
│   ├── videoController.js
│   └── videoInteraction.js
├── middleware/         # Custom middleware
├── models/             # Mongoose models
│   ├── channelModel.js
│   ├── commentModel.js
│   ├── userModel.js
│   └── videoModel.js
├── routes/             # API routes
│   ├── channelRoutes.js
│   ├── userRoutes.js
│   └── videoRoutes.js
├── utils/              # Utility functions
├── app.js              # Express app setup
└── server.js           # Server entry point
```

## Controllers Overview

### authController.js
Handles user authentication, registration, login, Google OAuth, and JWT token management.

### userController.js
Manages user profiles, photo uploads, and user management.

### channelController.js
Controls channel creation, updates, subscriptions, and details.

### videoController.js
Handles video uploads, processing, CRUD operations, and video search/filters.

### videoInteraction.js
Manages likes, dislikes, comments, and other video interactions.

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with the variables listed above
4. Run the development server:
   ```bash
   npm run dev
   ```

## Video Upload Flow

1. Client uploads video file to the server
2. Backend validates the file and uploads it to Cloudinary
3. Video is processed by Cloudinary (transcoding, thumbnail generation, etc.)
4. Metadata is stored in MongoDB
5. Client is notified when processing is complete

## Error Handling

The API implements a global error handling middleware that provides consistent error responses:

```json
{
  "status": "error",
  "message": "Error message details",
  "error": { /* Detailed error object */ }
}
```

## Production Deployment

The API is deployed on Render at:
```
https://streamline-backend-09ip.onrender.com/api/v1
```

## Testing

Run tests with:
```bash
npm test
```