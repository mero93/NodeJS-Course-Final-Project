import { Test, TestingModule } from '@nestjs/testing';
import { VinylController } from './vinyls.controller.js';
import { VinylsService } from './vinyls.service.js';

describe('VinylController', () => {
  let controller: VinylController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VinylController],
      providers: [VinylsService],
    }).compile();

    controller = module.get<VinylController>(VinylController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
