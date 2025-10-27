import { Module } from '@nestjs/common';
import { VinylsService } from './vinyls.service.js';
import { VinylController } from './vinyls.controller.js';

@Module({
  controllers: [VinylController],
  providers: [VinylsService],
})
export class VinylModule {}
