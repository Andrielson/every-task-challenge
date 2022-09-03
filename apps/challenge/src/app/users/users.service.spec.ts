import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from './users.service';
import USERS from './users';

describe('UsersService', () => {
  let cryptoService: CryptoService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService, UsersService],
    }).compile();

    cryptoService = module.get<CryptoService>(CryptoService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should find one existing user by email', async () => {
    const existingEmail = USERS[2].email;
    jest
      .spyOn(cryptoService, 'encodePassword')
      .mockImplementation((value) => Promise.resolve(value));
    await userService.onModuleInit();

    const user = userService.findOne(existingEmail);

    expect(user).toEqual(USERS[2]);
  });

  it('should return null if does not find a user with supplied email', () => {
    const loggerSpy = jest.spyOn(userService['logger'], 'log');
    const email = 'some@email.com';

    const user = userService.findOne(email);

    expect(user).not.toBeTruthy();
    expect(loggerSpy).toHaveBeenCalledWith(`User not found: ${email}!`);
  });
});
