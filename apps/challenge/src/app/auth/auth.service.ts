import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { CryptoService } from '../crypto/crypto.service';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(email: string, password: string) {
    const user = this.usersService.findOne(email);
    const validPassword =
      user &&
      (await this.cryptoService.verifyPassword(password, user.password));

    if (!validPassword) {
      this.logger.log(`Invalid credentials for ${email}!`);
      return null;
    }

    const { password: _, ...publicUserData } = user;
    return publicUserData;
  }

  async login({ email, id }: User) {
    const payload = { username: email, sub: id, jti: randomUUID() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
