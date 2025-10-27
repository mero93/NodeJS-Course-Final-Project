import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';
import { CreateReviewDto } from '../../models/dtos/review.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get(':vinylId')
  getVinylReviews(@Param('vinylId') vinylId: number) {
    // Should load all reviews for current vinyl.
  }

  @UseGuards(AccessAuthGuard)
  @Post('create')
  createReview(@Body() body: CreateReviewDto) {
    // This part should create new review
  }

  // Admin Guard
  @Delete('delete/:reviewId')
  deleteReview() {
    // This part should delete review
  }
}
