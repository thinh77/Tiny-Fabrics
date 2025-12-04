import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'tiny-fabrics-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

// Middleware to authenticate requests
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token xác thực không hợp lệ',
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Token hết hạn hoặc không hợp lệ',
      });
    }

    // Verify user still exists and is active
    const user = await authService.findUserById(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa',
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi xác thực',
    });
  }
};

// Middleware to check admin role
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Bạn không có quyền thực hiện hành động này',
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      
      if (payload) {
        const user = await authService.findUserById(payload.userId);
        if (user && user.isActive) {
          req.user = payload;
        }
      }
    }
    
    next();
  } catch {
    next();
  }
};
