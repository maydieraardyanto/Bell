import { Test, TestingModule } from '@nestjs/testing';
import { BellsController } from './bells.controller';
import { BellsService } from './bells.service';

describe('BellsController', () => {
  let controller: BellsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BellsController],
      providers: [BellsService],
    }).compile();

    controller = module.get<BellsController>(BellsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
