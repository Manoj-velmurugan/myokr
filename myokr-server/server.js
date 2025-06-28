import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './utils/db.js';  // make sure the path is correct

import teamRoutes from './routes/teams.js';
import departmentRoutes from './routes/departments.js';
import userRoutes from './routes/users.js';
import okrRoutes from './routes/okrs.js';
import authRoutes from './routes/Auth.js'
import employeeRoutes from './routes/employee.js';


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
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
  console.log(`🚀 Server started on port ${PORT}`);
});
