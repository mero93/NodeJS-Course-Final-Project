import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserRole } from '../models/entities/user.entity.js';
import { Genre, Style, Vinyl } from '../models/entities/vinyl.entity.js';
import { Order } from '../models/entities/order.entity.js';
import { OrderItem } from '../models/entities/orderItem.entity.js';
import { Review } from '../models/entities/review.entity.js';
import { ReviewSubscriber } from '../models/subscribers/review.subscriber.js';
import { RevokedToken } from '../models/entities/revokedToken.entity.js';
import { VinylSubscriber } from '../models/subscribers/vinyl.subscriber.js';
import { Author } from '../models/entities/author.entity.js';
import { OAuthAccount } from '../models/entities/oAuthAccount.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          url: isProduction ? configService.getOrThrow('DATABASE_URL') : undefined,
          host: !isProduction ? configService.getOrThrow('POSTGRES_HOST') : undefined,
          port: !isProduction ? configService.getOrThrow<number>('POSTGRES_PORT') : undefined,
          username: !isProduction ? configService.getOrThrow('POSTGRES_USER') : undefined,
          password: !isProduction ? configService.getOrThrow('POSTGRES_PASSWORD') : undefined,
          database: !isProduction ? configService.getOrThrow('POSTGRES_DB') : undefined,
          ssl: isProduction ? { rejectUnauthorized: false } : undefined,
          entities: [
            User,
            UserRole,
            Vinyl,
            Order,
            OrderItem,
            Review,
            RevokedToken,
            Author,
            OAuthAccount,
            Style,
            Genre,
          ],
          subscribers: [ReviewSubscriber, VinylSubscriber],
          synchronize: false,
        };
      },
    }),
  ],
})
export class DataModule {}
