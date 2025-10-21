import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';

describe('VinylController', () => {
  let controller: VinylController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinylController],
      providers: [VinylService],
    }).compile();

    controller = module.get<VinylController>(VinylController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
