import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

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

  async login({ email, password }: LoginDto) {
    const user = await this.validateUser(email, password);
    const payload = { username: email, sub: user.id, jti: randomUUID() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
