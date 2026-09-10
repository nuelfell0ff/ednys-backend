import { Request, Response } from 'express';
import { AuthenticatedUser } from '../../types/auth';
import {
  loginUser,
  registerSchoolAdmin,
} from './auth.service';
import {
  LoginInput,
  RegisterInput,
} from './auth.types';

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body as RegisterInput;

    const result = await registerSchoolAdmin(data);

    res.status(201).json({
      success: true,
      message: 'School registered successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Registration failed',
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body as LoginInput;

    const result = await loginUser(data);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Login failed',
    });
  }
};

export const getMeController = (
  req: Request,
  res: Response
): void => {
  const user = req.user as AuthenticatedUser;

  res.status(200).json({
    success: true,
    data: user,
  });
};