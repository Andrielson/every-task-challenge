import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  private readonly users: User[] = [
    {
      id: randomUUID(),
      email: 'user_one@email.com',
      password: 'password-one',
    },
    {
      id: randomUUID(),
      email: 'user_two@email.com',
      password: 'password-two',
    },
    {
      id: randomUUID(),
      email: 'user_three@email.com',
      password: 'password-three',
    },
  ];

  findOne(email: string): User | undefined {
    const user = this.users.find((user) => user.email === email);
    if (!user) this.logger.log(`User not found: ${email}!`);
    return user;
  }
}
