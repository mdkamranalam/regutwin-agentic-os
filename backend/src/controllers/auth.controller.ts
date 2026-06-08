import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userRepository } from '../database/repositories/UserRepository';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password, role, department } = req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const passwordHash = await authService.hashPassword(password);
      const user = await userRepository.create({
        username,
        email,
        passwordHash,
        role,
        department
      });

      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.authenticate(email, password);
      res.json({ token, user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
