import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../models/entities/review.entity.js';
import { ReviewModel } from '../../models/interfaces/review.interface.js';
import { CreateReviewDto } from '../../models/dtos/review.dto.js';
import { TokenUser } from '../../models/interfaces/user.interface.js';
import { User } from '../../models/entities/user.entity.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async getVinylReviews(vinylId: number): Promise<ReviewModel[]> {
    const reviews = await this.reviewsRepository.find({
      where: { vinylId: vinylId },
      relations: ['user'],
    });

    return reviews.map((review) => {
      return {
        id: review.id,
        userId: review.userId,
        vinylId: review.vinylId,
        userName: review.user.name,
        userLastName: review.user.lastName,
        userAvatar: review.user.avatar,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  }

  async getUserReviews(userId: number): Promise<ReviewModel[]> {
    const reviews = await this.reviewsRepository.find({
      where: { userId: userId },
      relations: ['vinyl'],
    });

    return reviews.map((review) => {
      return {
        id: review.id,
        userId: review.userId,
        vinylId: review.vinylId,
        userName: review.user.name,
        userLastName: review.user.lastName,
        userAvatar: review.user.avatar,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  }

  async createReview(reviewDto: CreateReviewDto, userId: number): Promise<ReviewModel> {
    const review = await this.reviewsRepository.save({
      ...reviewDto,
      userId: userId,
    });

    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...review,
      userName: user.name,
      userLastName: user.lastName,
      userAvatar: user.avatar,
    };
  }

  async updateReview(reviewDto: CreateReviewDto, userId: number): Promise<ReviewModel> {
    const review = await this.reviewsRepository.findOne({
      where: { userId: userId, vinylId: reviewDto.vinylId },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.rating = reviewDto.rating;
    review.comment = reviewDto.comment;

    const updatedReview = await this.reviewsRepository.save(review);

    return {
      ...updatedReview,
      userLastName: review.user.lastName,
      userName: review.user.name,
      userAvatar: review.user.avatar,
    };
  }

  async deleteUserReview(vinylId: number, userId: number): Promise<void> {
    const review = await this.reviewsRepository.findOne({
      where: { vinylId: vinylId, userId: userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    await this.reviewsRepository.remove(review);
  }

  async deleteReviewById(reviewId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.remove(review);
  }
}
