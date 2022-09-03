import { Injectable, Logger } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly cryptoService: CryptoService,
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
}
