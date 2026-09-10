import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserRole } from '../modules/users/user.model';
import { AuthenticatedUser } from '../types/auth';

interface AccessTokenPayload {
  userId: string;
  schoolId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({
      success: false,
      message: 'Invalid authorization format',
    });

    return;
  }

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    res.status(500).json({
      success: false,
      message: 'Authentication configuration error',
    });

    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as AccessTokenPayload;

    if (
      !decoded.userId ||
      !decoded.schoolId ||
      !decoded.role
    ) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });

      return;
    }

    if (!Object.values(UserRole).includes(decoded.role)) {
      res.status(401).json({
        success: false,
        message: 'Invalid user role',
      });

      return;
    }

    req.user = {
      userId: decoded.userId,
      schoolId: decoded.schoolId,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }
};