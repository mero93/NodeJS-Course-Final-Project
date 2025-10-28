import { Module } from '@nestjs/common';
import { VinylsService } from './vinyls.service.js';
import { VinylController } from './vinyls.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre, Style, Vinyl } from '../../models/entities/vinyl.entity.js';
import { Author } from '../../models/entities/author.entity.js';
import { Review } from '../../models/entities/review.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Vinyl, Review, Author, Genre, Style])],
  controllers: [VinylController],
  providers: [VinylsService],
})
export class VinylModule {}
