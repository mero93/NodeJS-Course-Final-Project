import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';
import { CreateReviewDto, UpdateReviewDto } from '../../models/dtos/review.dto.js';
import { AuthRequest } from '../../models/interfaces/user.interface.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get(':vinylId')
  async getVinylReviews(@Param('vinylId') vinylId: number) {
    return await this.reviewsService.getVinylReviews(vinylId);
  }

  @Get('user-reviews/:userId')
  async getUserReviews(@Param('userId') userId: number) {}

  @UseGuards(AccessAuthGuard)
  @Post('create')
  async createReview(@Req() req: AuthRequest, @Body() body: CreateReviewDto) {
    return await this.reviewsService.createReview(body, req.user!.id);
  }

  @UseGuards(AccessAuthGuard)
  @Post('create')
  async Put(@Body() body: UpdateReviewDto, @Req() req: AuthRequest) {
    return await this.reviewsService.updateReview(body, req.user!.id);
  }

  // Admin Guard
  @Delete('delete/:vinylId')
  async deleteReview(@Req() req: AuthRequest, @Param('vinylId') vinylId: number) {
    return await this.reviewsService.deleteReview(vinylId, req.user!.id);
  }
}
