import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service.js';

describe('VinylService', () => {
  let service: VinylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VinylService],
    }).compile();

    service = module.get<VinylService>(VinylService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
