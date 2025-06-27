# Project-Collaboration-App-Client-Freelancer-Portal-
Project Collaboration App (Client–Freelancer Portal)

How to Project Setup All Step Below :- 

# MERN Stack Mini Project Collaboration App

A full-stack MERN application that allows clients to create and assign projects to freelancers, with role-based authentication and project management.

## 🚀 Features

### Authentication & Authorization
- **User Registration**: Sign up as either a client or freelancer
- **User Login**: Secure authentication with JWT tokens
- **Role-based Access**: Different dashboards for clients and freelancers
- **Form Validation**: Email, password, and name validation
- **Logout Functionality**: Secure session termination

### Project Management
- **Client Features**:
  - Create new projects with title, description, and deadline
  - Assign projects to freelancers via dropdown
  - View all created projects with freelancer names
  - Real-time project list updates

- **Freelancer Features**:
  - View only projects assigned to them
  - See project details including deadlines


## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Fetch API**: HTTP requests
- **LocalStorage**: Session management

## 📁 Project Structure

```
Practics-MERN/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Project.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── projectController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── projectRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   └── my-react-app/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Login.js
│       │   │   ├── Register.js
│       │   │   └── Dashboard.js
│       │   ├── components/
│       │   │   ├── ClientDashboard.js
│       │   │   └── FreelancerDashboard.js
│       │   └── App.js
│       └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env` file in the server directory with:
   ```
   JWT_SECRET=your_jwt_secret_key_here
   MONGO_URI=your_mongodb_connection_string_here
   PORT=5000
   ```

4. **Start the server**:
   ```bash
   node server.js
   ```
   or with nodemon:
   ```bash
   nodemon server.js
   ```

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client/my-react-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/freelancers` - Get all freelancers (client only)

### Projects
- `POST /api/projects` - Create project (client only)
- `POST /api/projects/:id/assign` - Assign project to freelancer (client only)
- `GET /api/projects` - Get client's projects (client only)
- `GET /api/projects/assigned` - Get freelancer's assigned projects (freelancer only)

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['client', 'freelancer']),
  assignedProjects: [ObjectId] (ref: 'Project')
}
```

### Project Model
```javascript
{
  title: String (required),
  description: String,
  deadline: Date,
  clientId: ObjectId (ref: 'User', required),
  freelancerId: ObjectId (ref: 'User')
}
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Middleware protection for routes
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin requests

## 🎯 Usage Guide

### For Clients
1. Register with role "client"
2. Login to access dashboard
3. Create projects with title, description, and deadline
4. Assign projects to freelancers from the dropdown
5. View all created projects with assignment status

### For Freelancers
1. Register with role "freelancer"
2. Login to access dashboard
3. View projects assigned to you
4. See project details and deadlines



If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check network connectivity

---

**Built with ❤️ using the MERN Stack**



