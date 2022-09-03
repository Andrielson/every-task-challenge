import { FactoryProvider, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto/crypto.service';
import { User } from '../users/user.interface';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let cryptoService: CryptoService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, CryptoService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    cryptoService = module.get<CryptoService>(CryptoService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should login successfully', async () => {
    const mockedUser: User = {
      id: '1',
      email: 'user@email.com',
      password: 'password',
    };
    jest.spyOn(userService, 'findOne').mockReturnValueOnce(mockedUser);
    jest.spyOn(cryptoService, 'verifyPassword').mockResolvedValueOnce(true);
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('jwt');

    const result = await authService.login({
      email: mockedUser.email,
      password: mockedUser.password,
    });

    expect(result).toBeTruthy();
    expect(result).toHaveProperty('access_token');
    expect(result.access_token).toBe('jwt');
  });

  it('should throw unauthorized if credentials are invalid', async () => {
    const mockedUser: User = {
      id: '1',
      email: 'user@email.com',
      password: 'password',
    };
    jest.spyOn(userService, 'findOne').mockReturnValueOnce(mockedUser);
    jest.spyOn(cryptoService, 'verifyPassword').mockResolvedValueOnce(false);

    let result: Record<string, string>;

    try {
      result = await authService.login({
        email: mockedUser.email,
        password: mockedUser.password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(result).not.toBeTruthy();
    }
  });
});

export const authServiceProvider: FactoryProvider = {
  provide: AuthService,
  useFactory: () => ({
    validateUser: jest.fn(() => ({ id: 'id', email: 'user@email.com' })),
    login: jest.fn(() => ({ access_token: 'jwt' })),
  }),
};
