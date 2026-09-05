import { Test, TestingModule } from '@nestjs/testing';
import { BellsService } from './bells.service';

describe('BellsService', () => {
  let service: BellsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BellsService],
    }).compile();

    service = module.get<BellsService>(BellsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
