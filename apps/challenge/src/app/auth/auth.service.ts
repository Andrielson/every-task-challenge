import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly usersService: UsersService) {}

  validateUser(email: string, password: string) {
    const user = this.usersService.findOne(email);
    if (user?.password !== password) {
      this.logger.log(`Invalid credentials for ${email}!`);
      return null;
    }
    const { password: _, ...publicUserData } = user;
    return publicUserData;
  }
}
