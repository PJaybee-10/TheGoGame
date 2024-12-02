import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todo';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the Todo API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('POST /auth/register - Register a new user');
  console.log('POST /auth/login - Login user');
  console.log('GET /auth/verify - Verify token');
  console.log('GET /todos - Get all todos');
});

export default app;
