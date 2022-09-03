import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate', async () => {
    const payload = { sub: 'sub', username: 'username' };
    const validated = await strategy.validate(payload);
    expect(validated).toBeTruthy();
    expect(validated.email).toBe(payload.username);
    expect(validated.id).toBe(payload.sub);
  });
});
