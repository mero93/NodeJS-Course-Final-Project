import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { AtLeastOneFieldIsRequired } from './customClassValidators.js';

export class CreateVinylDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsUrl({}, { message: 'A valid image URL must be provided.' })
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  inStock: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authors: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  styles: string[];
}

export class UpdateVinylDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'A valid image URL must be provided.' })
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  inStock?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDate?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  authors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  styles?: string[];

  @AtLeastOneFieldIsRequired([
    'name',
    'description',
    'image',
    'price',
    'inStock',
    'releaseDate',
    'authors',
    'genres',
    'styles',
  ])
  @Exclude()
  private readonly _placeholder = '';
}
