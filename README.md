# Streamline - Video Streaming Platform

## project live - https://streamline02.vercel.app/

Streamline is a full-stack video streaming platform inspired by YouTube, allowing users to upload, view, like, comment on videos, and subscribe to channels.



## Features

- **User Authentication**: Secure login/signup with email or Google OAuth
- **Video Management**: Upload, view, edit, and delete videos
- **Channel Management**: Create and customize your channel
- **Interaction**: Like/dislike videos, comment on videos, subscribe to channels
- **Dashboard**: User dashboard for managing content
- **Search & Discovery**: Search videos, trending section, video recommendations
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Tailwind CSS with DaisyUI themes
- Framer Motion for animations
- TanStack Query (React Query) for server state management
- React Icons

### Backend
- Node.js with Express
- MongoDB for database
- Cloudinary for video and image storage
- Google OAuth for authentication
- JWT for session management

## Project Structure

```
streamline/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── README.md          # Main project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Cloudinary account
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanketb-14/Streamline
cd streamline
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create `.env` files for both frontend and backend with appropriate configuration.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The API is hosted at: `https://streamline-backend-09ip.onrender.com/api/v1`

For detailed API documentation, see the [Backend README](./backend/README.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by YouTube
- Built with modern web technologies
- Created as a learning project
