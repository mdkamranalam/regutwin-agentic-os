import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../database/repositories/UserRepository';
import { IUser } from '../database/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const TOKEN_EXPIRY = '24h';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(user: IUser): Promise<string> {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  async authenticate(email: string, pass: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await this.comparePassword(pass, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = await this.generateToken(user);
    return { user, token };
  }
}

export const authService = new AuthService();
