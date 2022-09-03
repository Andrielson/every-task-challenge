import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { UsersService } from './users.service';

@Module({
  imports: [CryptoModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
