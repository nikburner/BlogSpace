# BlogSpace

A full-stack blogging platform built with modern web technologies, featuring user authentication, rich text editing, image uploads, and AI-powered content assistance.

## Overview

BlogSpace is a comprehensive blogging application that allows users to create, manage, and share blog posts with a rich editing experience. The platform includes user authentication, admin controls, and integrates with AI services for enhanced content creation.

## Features

### User Features
- **User Registration & Authentication**: Secure signup and login with JWT tokens
- **Blog Creation**: Rich text editor with Quill for creating engaging content
- **Image Uploads**: Integrated ImageKit for seamless image management
- **Personal Dashboard**: Manage your own blog posts
- **Responsive Design**: Works perfectly on desktop and mobile devices

### Admin Features
- **Content Moderation**: Admin panel for managing all blog posts
- **User Management**: Administrative controls over user accounts
- **Analytics**: Basic analytics and content oversight

### Technical Features
- **AI Integration**: Google Gemini AI for content assistance
- **Real-time Notifications**: Toast notifications for user feedback
- **Secure API**: RESTful API with proper authentication and authorization
- **File Upload Handling**: Multer middleware for file processing

## Tech Stack

### Frontend
- **React 19**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Bootstrap 5**: Responsive CSS framework
- **Quill Editor**: Rich text editing capabilities
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Notification system

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **ImageKit**: Image management and optimization
- **Google Gemini AI**: AI-powered content features

## Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn package manager
- ImageKit account (for image uploads)
- Google AI API key (for Gemini integration)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd BlogSpace-main
   ```

2. **Environment Setup:**
   Create `.env` file in the `server` directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

4. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

## Usage

### Development

1. **Start the Backend Server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Start the Frontend Development Server:**
   ```bash
   cd client
   npm run dev
   ```
   The client will be available at `http://localhost:5173`

### Production

1. **Build the Frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the Backend:**
   ```bash
   cd server
   npm start
   ```

The production build will be served from the backend, with CORS configured for the frontend.

## Project Structure

```
BlogSpace-main/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context for state management
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Application assets
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Application entry point
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── server/                 # Node.js backend application
│   ├── config/            # Configuration files
│   │   ├── db.js          # Database connection
│   │   ├── gemini.js      # AI integration config
│   │   └── imageKit.js    # Image service config
│   ├── controllers/       # Route controllers
│   │   ├── adminController.js
│   │   └── blogController.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── multerMiddleware.js
│   ├── models/            # Mongoose models
│   │   ├── blog.js
│   │   └── user.js
│   ├── routes/            # API routes
│   │   ├── adminRoutes.js
│   │   └── blogRoutes.js
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md              # This file
```

## API Documentation

### Authentication Endpoints
- `POST /api/admin/login` - User login
- `POST /api/admin/signup` - User registration

### Blog Endpoints
- `GET /api/blog/all-blogs` - Get all blogs
- `POST /api/blog/create-blog` - Create new blog (authenticated)
- `GET /api/blog/single-blog/:id` - Get single blog
- `PUT /api/blog/update-blog/:id` - Update blog (authenticated)
- `DELETE /api/blog/delete-blog/:id` - Delete blog (authenticated)
- `GET /api/blog/user-blog/:id` - Get user's blogs

### Admin Endpoints
- `GET /api/admin/all-users` - Get all users (admin only)
- `DELETE /api/admin/delete-user/:id` - Delete user (admin only)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 3000)
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public API key
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private API key
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint
- `GEMINI_API_KEY`: Google Gemini AI API key

