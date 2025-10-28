import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataModule } from '../data/data.module.js';
import { Author } from '../models/entities/author.entity.js';
import { Genre, Style, Vinyl } from '../models/entities/vinyl.entity.js';
import { User } from '../models/entities/user.entity.js';
import { SeederService } from './seeder.service.js';
import { Review } from '../models/entities/review.entity.js';

@Module({
  imports: [DataModule, TypeOrmModule.forFeature([User, Vinyl, Review, Author, Genre, Style])],
  providers: [SeederService],
})
export class SeederModule {}
