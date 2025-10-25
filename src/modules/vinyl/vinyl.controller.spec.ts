import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyl.controller.js';
import { VinylService } from './vinyl.service.js';

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
