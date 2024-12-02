import express, { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Get all todos for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Create a new todo
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = new Todo({
      title,
      description,
      priority: priority || 'medium',
      userId: req.user?.id,
    });

    await todo.save();
    return res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update a todo
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    const todo = await Todo.findOne({ _id: id, userId: req.user?.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.priority = priority || todo.priority;

    await todo.save();
    return res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete a todo
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user?.id });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({ message: 'Error deleting todo' });
  }
});

export default router;
