import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';
import { AtLeastOneFieldIsRequired, MatchPasswords } from './customClassValidators.js';

export class LoginUserDto {
  @IsEmail(
    {},
    {
      message: 'Email is not valid',
    }
  )
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public readonly email: string;

  @IsString()
  @Length(4, 32, {
    message: 'Password must be at least 4 and at most 32 characters long',
  })
  @Matches(/^[^\s]+$/, {
    message: 'Password must contain no white spaces',
  })
  public readonly password: string;
}

export class RegisterUserDto {
  @IsString()
  @Length(3, 16, {
    message: 'Name must be at least 3 and at most 16 characters long',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Name must contain only letters',
  })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public readonly name: string;

  @IsString()
  @Length(3, 16, {
    message: 'Last name must be at least 3 and at most 16 characters long',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain only letters',
  })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public readonly lastName: string;

  @IsEmail(
    {},
    {
      message: 'Email is not valid',
    }
  )
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public readonly email: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly birthDate: Date;

  @IsString()
  @Length(4, 32, {
    message: 'Password must be at least 4 and at most 32 characters long',
  })
  @Matches(/^[^\s]+$/, {
    message: 'Password must contain no white spaces',
  })
  public readonly password: string;

  @IsString()
  @MatchPasswords('password')
  public readonly confirmPassword: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 16, {
    message: 'Name must be at least 3 and at most 16 characters long',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Name must contain only letters',
  })
  public readonly name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 16, {
    message: 'Last name must be at least 3 and at most 16 characters long',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain only letters',
  })
  public readonly lastName?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly birthDate?: Date;

  @AtLeastOneFieldIsRequired(['name', 'lastName', 'birthDate'])
  @Exclude()
  private readonly _placeholder = '';
}

export class UpdateAvatarDto {
  @IsUrl({}, { message: 'A valid image URL must be provided.' })
  public readonly imgUrl: string;
}
