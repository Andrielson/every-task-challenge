import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encode password', async () => {
    const password = 'password';
    const encodePassword = await service.encodePassword(password);
    expect(encodePassword).toBeTruthy();
    expect(encodePassword).not.toBe(password);
    expect(encodePassword.length).toBeGreaterThan(password.length);
  });

  it('should verify password and hash', async () => {
    const password = 'password';
    const encodePassword = await service.encodePassword(password);
    const isEqual = await service.verifyPassword(password, encodePassword);
    expect(isEqual).toBe(true);
  });
});
