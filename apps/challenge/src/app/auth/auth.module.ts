import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [CryptoModule, UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
