import { ReviewModel } from './review.interface.js';

export interface VinylModel {
  id: number;
  name: string;
  description: string;
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
