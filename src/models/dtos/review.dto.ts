import { IsNumber, Min, Max, IsString, Length, IsOptional } from 'class-validator';
import { AtLeastOneFieldIsRequired } from './customClassValidators.js';
import { Exclude } from 'class-transformer';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  vinylId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  comment: string;
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  vinylId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  comment: string;
}
