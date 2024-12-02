import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define user interface
interface UserPayload {
  userId: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

class AuthMiddleware {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key';

  // Generate JWT token
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, this.SECRET_KEY, { 
      expiresIn: '7d' 
    });
  }

  // Middleware to protect routes
  static authenticateUser(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required. Please login.' 
      });
    }

    try {
      const decoded = jwt.verify(token, this.SECRET_KEY) as UserPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ 
        error: 'Invalid or expired token. Please login again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Login handler
  static async login(username: string, password: string) {
    // In a real app, you'd check against a database
    // For this example, we'll use a simple check
    if (username === 'testuser' && password === 'password') {
      const userId = 'user123'; // In real app, this would be from database
      const token = this.generateToken(userId);
      return { 
        userId, 
        token, 
        message: 'Login successful' 
      };
    }
    throw new Error('Invalid credentials');
  }

  // Refresh token mechanism
  static refreshToken(oldToken: string) {
    try {
      const decoded = jwt.verify(oldToken, this.SECRET_KEY) as UserPayload;
      return this.generateToken(decoded.userId);
    } catch (error) {
      throw new Error('Cannot refresh token');
    }
  }
}

export default AuthMiddleware;
