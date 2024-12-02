import express, { Request, Response } from 'express';
import Todo, { ITodo } from '../models/TodoModel';
import AuthMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Create Todo
router.post('/', AuthMiddleware.authenticateUser, async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const newTodo: ITodo = new Todo({
      title,
      description,
      userId,
      priority,
      dueDate,
      isCompleted: false
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error creating todo', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get All Todos for a User
router.get('/', AuthMiddleware.authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching todos', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update Todo
router.put('/:id', AuthMiddleware.authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, priority, dueDate } = req.body;
    const userId = req.user?.userId;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { 
        title, 
        description, 
        isCompleted, 
        priority, 
        dueDate,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error updating todo', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete Todo
router.delete('/:id', AuthMiddleware.authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ 
      error: 'Error deleting todo', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Mark Todo as Complete/Incomplete
router.patch('/:id/toggle', AuthMiddleware.authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.isCompleted = !todo.isCompleted;
    todo.updatedAt = new Date();
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error toggling todo status', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
