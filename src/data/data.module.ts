import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../models/entities/user.entity';
import { Vinyl } from '../models/entities/vinyl.entity';
import { Order } from '../models/entities/order.entity';
import { OrderItem } from '../models/entities/orderItem.entity';
import { Review } from '../models/entities/review.entity';
import { ReviewSubscriber } from '../models/entities/review.subscriber';

config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [User, Vinyl, Order, OrderItem, Review, ReviewSubscriber],
        migrations: ['./src/data/migrations/**'],
        synchronize: false,
      }),
    }),
  ],
})
export class DataModule {}
