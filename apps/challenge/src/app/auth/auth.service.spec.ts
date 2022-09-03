import { FactoryProvider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, CryptoService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

export const authServiceProvider: FactoryProvider = {
  provide: AuthService,
  useFactory: () => ({
    validateUser: jest.fn(() => ({ id: 'id', email: 'user@email.com' })),
    login: jest.fn(() => ({ access_token: 'jwt' })),
  }),
};
