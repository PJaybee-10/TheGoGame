import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Custom interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// Authentication middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all todos for a user
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Create a new todo
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        priority: priority || 'medium',
        userId: req.user.id
      }
    });

    return res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update a todo
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title || todo.title,
        description: description || todo.description,
        completed: completed !== undefined ? completed : todo.completed,
        priority: priority || todo.priority
      }
    });

    return res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete a todo
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { id } = req.params;
    
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id }
    });

    return res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ message: 'Error deleting todo' });
  }
});

export default router;
