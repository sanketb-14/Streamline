# Streamline Frontend
### project live - https://streamline02.vercel.app/
This is the frontend application for Streamline, a video streaming platform built with React, Tailwind CSS, and modern web technologies.

## Features

- **Responsive Design**: Fully responsive UI using Tailwind CSS and DaisyUI
- **Authentication**: Email/password and Google OAuth integration
- **Video Player**: Custom video player with playback controls
- **Video Upload**: Upload, edit, and manage videos
- **Channel Management**: Create and customize your channel
- **User Dashboard**: Manage videos, channel settings, and account
- **Video Interactions**: Like, dislike, comment, and subscribe
- **Search & Discovery**: Search videos, browse by tags, and get recommendations
- **Smooth Animations**: Page transitions and UI animations using Framer Motion

## Tech Stack

- **React**: Frontend library using Vite for fast development
- **React Router**: For client-side routing
- **TanStack Query**: For server state management
- **Tailwind CSS**: For styling
- **DaisyUI**: For UI components and themes
- **Framer Motion**: For animations
- **React Icons**: For iconography

## Directory Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── channel/     # Channel-related components
│   │   ├── common/      # Common UI components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── layout/      # Layout components (header, footer, etc.)
│   │   ├── video/       # Video-related components
│   │   └── Header/          # UI elements (buttons, cards, etc.)
│   ├── hooks/         # React contexts
│   │   └── useAuth.js  # Authentication 
        └── useChannel.js
        └── useSubscribers.js
        └── useUserProfile.js
        └── useVideo.js
        └── useVideos.js

│   ├── providers/           # Custom provider
│   │   ├── AuthProvider.jsx   # Authentication 
│   │   ├── ToastProvider.jsx     
│   
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Homepage
│   │   ├── VideoPage.jsx # Video viewing page
│   │
│   │   └── NotFound.jsx # 404 page
│   ├── services/        # API service functions
│   │ 
│   │   ├── auth.js # Authentication API
│   │   ├── axios.js

├── .env                 # Environment variables
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration
```

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_BACKEND_URL=https://streamline-backend-09ip.onrender.com/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Key Components

### VideoPlayer

Custom video player with playback controls, quality selection, and fullscreen support.

### VideoUploader

Component for uploading, processing, and publishing videos with metadata and thumbnail selection.

### ChannelHeader

Displays channel info, subscriber count, and subscribe button.

### CommentSection

Threaded comment system with likes/dislikes and replies.

### VideoCard

Displays video thumbnail, title, channel, and view count in grid layouts.

### DashboardSidebar

Navigation for the user dashboard with sections for videos, analytics, and settings.

## Pages

### Home

- Featured videos
- Trending section
- Recommended videos based on user history

### VideoPage

- Video player
- Video metadata
- Creator info
- Comment section
- Related videos

### ChannelPage

- Channel header
- Videos tab
- About tab
- Custom channel layout options

### Dashboard

- Video management
- Channel customization
- Analytics
- Settings

### Search

- Search results with filtering options
- Tag-based filtering

## Authentication Flow

1. User signs up with email/password or Google OAuth
2. JWT token is stored in local storage
3. Auth context provides user state throughout the app
4. Protected routes redirect unauthenticated users

## State Management

- **TanStack Query**: For server state (videos, channels, comments)
- **React Context**: For global app state (auth, theme)
- **Local State**: For component-specific state

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with the variables listed above
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Key Features Implementation


## Build and Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

3. Deploy to your hosting provider of choice (Netlify, Vercel, etc.)

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers: Chrome for Android, Safari iOS