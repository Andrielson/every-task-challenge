import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { User } from './user.interface';
import { CryptoService } from '../crypto/crypto.service';
import USERS from './users';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  private readonly users: User[] = [];

  constructor(private readonly cryptoService: CryptoService) {}

  findOne(email: string): User | undefined {
    const user = this.users.find((user) => user.email === email);
    if (!user) this.logger.log(`User not found: ${email}!`);
    return user;
  }

  onModuleInit() {
    USERS.forEach(async (user) => {
      const password = await this.cryptoService.encodePassword(user.password);
      this.users.push({ ...user, password });
    });
  }
}
