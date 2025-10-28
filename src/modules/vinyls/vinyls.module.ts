import { Module } from '@nestjs/common';
import { VinylsService } from './vinyls.service.js';
import { VinylsController } from './vinyls.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre, Style, Vinyl } from '../../models/entities/vinyl.entity.js';
import { Author } from '../../models/entities/author.entity.js';
import { Review } from '../../models/entities/review.entity.js';
import { DiscogsModule } from '../../discogs/discogs.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl, Review, Author, Genre, Style]), DiscogsModule],
  controllers: [VinylsController],
  providers: [VinylsService],
})
export class VinylsModule {}
