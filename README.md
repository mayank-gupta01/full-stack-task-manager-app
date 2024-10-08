# Fullstack Task Management Application

[Demo Link](https://youtu.be/BmT0luW1iBE)

### Installation
```
https://github.com/mayank-gupta01/full-stack-task-manager-app
```


<br><br>

# Task Management Applicaton - Backend
## Overview
This backend provides the API and core functionalities for a task management application. It handles user authentication, task creation, task status management, and serves task statistics. The system is built using Node.js, MongoDB, and integrates with Cloudinary for image handling. It also uses JWT for secure authentication, and follows a monorepo structure.



## Features
- User Authentication: Signup, login, and logout with JWT-based authentication and cookies for session management.
- Task Management: Create, update, and delete tasks, toggle status (pending/completed), and prioritize tasks.
- Task Analytics: Retrieve task counts and statistics (total, today's tasks, completed, pending).
- Image Handling: User can upload and manage profile pictures via Cloudinary.
- Monorepo Structure: Organized and scalable project architecture.


## Tech Stack
- Node.js
- MongoDB (for database management)
- Cloudinary (for image storage)
- Multer (for file uploads)
- JWT (for authentication and authorization)
- Mongoose (for MongoDB object modeling)
- CORS (for cross-origin resource sharing)

## NPM Packages Used
- bcrypt - For password encryption
- cloudinary - For Cloudinary API integration
- cookie-parser - For managing cookies
- cors - For managing CORS
- dotenv - For loading environment variables
- express - For setting up the server and routing
- jsonwebtoken - For JWT-based authentication
- mongoose - For MongoDB interactions
- multer - For handling file uploads


## Environment Variables
Configure your .env file with the following variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net
PORT=8000
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=1d
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=15m
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CORS_ORIGIN=http://localhost:3000

```

## Running the Backend
1. Install dependencies: npm install  
2. Set up your environment variables in .env.  
3. Run the development server: npm run dev  
4. The backend will run on http://localhost:8000.  


<br><br><br><br><br>

# Task Management Application - Frontend

## Overview
The frontend provides a responsive user interface for managing tasks, visualizing task statistics through charts, and handling user profiles. Built using React.js and Material UI, it communicates with the backend using Axios for API requests. The frontend is designed with user-friendly components and features including task management, task prioritization, and authentication.


## Features

- **Task Management**:
  - Create, update, and delete tasks with title, description, due date, and priority.
  - Toggle task status (pending/completed).
  - Visualize task statistics with a pie chart showing pending, completed, and today's tasks.

- **User Authentication**:
  - Signup, login, and logout with JWT-based authentication.
  - Profile management, including uploading a profile picture.

- **Task Statistics**:
  - Pie chart visualization for task status (pending, completed, due today).


## Tech Stack
- TypeScript (for type safety)
- React.js (for building the UI)
- Material UI (for styling and UI components)
- Axios (for HTTP requests to the backend)
- PieChart Tags (Tags in material UI for creating charts and graphs)


## Running the Frontend
1. Install dependencies: npm install
2. Configure your .env file (if necessary) for backend API URL.
3. Run the development server: npm start
4. The frontend will run on http://localhost:3000.

<br><br><br>

## Screenshots
Signup Page
![alt text](image-1.png)

Login Page
![alt text](image.png)

Dashboard
![alt text](image-2.png)

Add Task Dialog Box
![alt text](image-3.png)

Showing Pie Chart (After add some task)
![alt text](image-5.png)
![alt text](image-4.png)


