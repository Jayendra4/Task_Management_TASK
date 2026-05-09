# Task Management System

## 🚀 Live Demo
**[task-management-task-sigma.vercel.app]** 

## Project Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd TASKMANAGEMENT
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd Client
npm install
cd ..
```

## Environment Variable Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
PORT=7000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Database Setup Instructions

1. Go to MongoDB Atlas and create a free account
2. Create a new cluster (M0 free tier)
3. Create a database user with username and password
4. Click "Connect" → "Connect your application" → copy the connection string
5. Replace the placeholder values in your MONGO_URI with your actual credentials
6. Add your IP address to the access list (use 0.0.0.0/0 for development)

## API Run Instructions

1. Make sure your `.env` file is configured correctly
2. Start the backend server:
```bash
npm start
```
3. The API will be running at `http://localhost:7000`

## Frontend Run Instructions

1. Navigate to the Client directory:
```bash
cd Client
```

2. Start the development server:
```bash
npm run dev
```

3. The frontend will be available at `http://localhost:5173`

## Quick Start Summary

1. Set up your `.env` file with MongoDB connection string
2. Run `npm install` in root directory
3. Run `npm install` in Client directory  
4. Start backend with `npm start` (runs on port 7000)
5. Start frontend with `npm run dev` in Client folder (runs on port 5173)


