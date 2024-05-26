import { Test, TestingModule } from '@nestjs/testing';
import { AmoUsersController } from './amo-users.controller';
import { AmoUsersService } from './amo-users.service';

describe('AmoUsersController', () => {
  let controller: AmoUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmoUsersController],
      providers: [AmoUsersService],
    }).compile();

    controller = module.get<AmoUsersController>(AmoUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
