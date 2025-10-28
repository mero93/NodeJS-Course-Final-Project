import { Module } from '@nestjs/common';
import { DiscogsService } from './discogs.service.js';

@Module({
  providers: [DiscogsService],
  exports: [DiscogsService],
})
export class DiscogsModule {}
