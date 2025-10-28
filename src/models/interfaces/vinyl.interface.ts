import { Author } from '../entities/author.entity.js';
import { ReviewModel } from './review.interface.js';
import { Genre, Style } from '../entities/vinyl.entity.js';

export interface VinylModel {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  inStock: number;
  ratingAvg?: number;
  ratingCount?: number;
  discogId?: number;
  ratingDiscogAvg?: number;
  ratingDiscogCount?: number;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  reviews?: ReviewModel[];
  authors?: string[];
  styles?: string[];
  genres?: string[];
}
