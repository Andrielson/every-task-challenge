import { randomFillSync } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { bcrypt, bcryptVerify } from 'hash-wasm';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);

  async encodePassword(password: string) {
    const salt = new Uint8Array(16);
    randomFillSync(salt);

    try {
      return await bcrypt({
        password,
        salt,
        costFactor: 11,
      });
    } catch (error) {
      this.logger.error(
        'An error was throwed while encoding password: ',
        error
      );
      throw new Error('Password encryption exception');
    }
  }

  async verifyPassword(password: string, hash: string) {
    try {
      return await bcryptVerify({ password, hash });
    } catch (error) {
      this.logger.error(
        'An error was throwed while verifying password: ',
        error
      );
      throw new Error('Password verify exception');
    }
  }
}
