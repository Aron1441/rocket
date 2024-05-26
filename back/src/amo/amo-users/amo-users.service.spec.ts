import { Test, TestingModule } from '@nestjs/testing';
import { AmoUsersService } from './amo-users.service';

describe('AmoUsersService', () => {
  let service: AmoUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmoUsersService],
    }).compile();

    service = module.get<AmoUsersService>(AmoUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
