import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { validateLoginInput, validateRegisterInput } from '../validation/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create default user if it doesn't exist
const createDefaultUser = async () => {
  try {
    const defaultUsername = 'Test123';
    const existingUser = await prisma.user.findUnique({
      where: { username: defaultUsername }
    });
    
    if (!existingUser) {
      await prisma.user.create({
        data: {
          username: defaultUsername,
          password: await bcrypt.hash('Test123!', 10)
        }
      });
      console.log('Default user created successfully');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

// Call this when the server starts
createDefaultUser();

// Test route
router.get('/test', (_req: Request, res: Response) => {
  res.json({ message: 'Auth route is working' });
});

// Login
router.post('/login', async (_req: Request, res: Response) => {
  try {
    const { username, password } = _req.body;

    // Validate input
    const { errors, isValid } = validateLoginInput(_req.body);
    if (!isValid) {
      console.log('Login validation failed:', errors);
      return res.status(400).json(errors);
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Register
router.post('/register', async (_req: Request, res: Response) => {
  try {
    const { username, password } = _req.body;
    
    // Validate input
    const { errors, isValid } = validateRegisterInput(_req.body);
    if (!isValid) {
      console.log('Register validation failed:', errors);
      return res.status(400).json(errors);
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(201).json({ 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify token
router.get('/verify', async (_req: Request, res: Response) => {
  const token = _req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
