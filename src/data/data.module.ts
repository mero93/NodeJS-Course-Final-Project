import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../models/entities/user.entity.js';
import { Genre, Style, Vinyl } from '../models/entities/vinyl.entity.js';
import { Order } from '../models/entities/order.entity.js';
import { OrderItem } from '../models/entities/orderItem.entity.js';
import { Review } from '../models/entities/review.entity.js';
import { ReviewSubscriber } from '../models/subscribers/review.subscriber.js';
import { RevokedToken } from '../models/entities/revokedToken.entity.js';
import { VinylSubscriber } from '../models/subscribers/vinyl.subscriber.js';
import { Author } from '../models/entities/author.entity.js';
import { OAuthAccount } from '../models/entities/OAuthAccount.entity.js';

config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [
          User,
          Vinyl,
          Order,
          OrderItem,
          Review,
          ReviewSubscriber,
          RevokedToken,
          VinylSubscriber,
          Author,
          OAuthAccount,
          Style,
          Genre,
        ],
        // migrations: ['./src/data/migrations/**'],
        synchronize: true,
      }),
    }),
  ],
})
export class DataModule {}
