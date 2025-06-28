import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './utils/db.js';  // make sure the path is correct

import teamRoutes from './routes/teams.js';
import departmentRoutes from './routes/departments.js';
import userRoutes from './routes/users.js';
import okrRoutes from './routes/okrs.js';
import authRoutes from './routes/auth.js'
import employeeRoutes from './routes/employee.js';


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: 'https://your-frontend.vercel.app', // or "*" for all, not safe in production
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/teams', teamRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/okrs', okrRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);




// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});
