import { BaseRepository } from '../repositories/BaseRepository';
import User from '../models/User';
import { IUser } from '../models/User';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  async findByUsername(username: string) {
    return this.model.findOne({ username }).exec();
  }
}

export const userRepository = new UserRepository();
