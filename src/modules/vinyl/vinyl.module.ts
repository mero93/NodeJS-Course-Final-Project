import { Module } from '@nestjs/common';
import { VinylService } from './vinyl.service.js';
import { VinylController } from './vinyl.controller.js';

@Module({
  controllers: [VinylController],
  providers: [VinylService],
})
export class VinylModule {}
