import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes';
import AuthMiddleware from './middleware/authMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Authentication Routes
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthMiddleware.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Protected Todo Routes
app.use('/todos', todoRoutes);

// Global Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    details: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
