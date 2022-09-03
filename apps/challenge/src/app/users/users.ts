import { randomUUID } from 'crypto';
import { User } from './user.interface';

export default [
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
] as User[];
