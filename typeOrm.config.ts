import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Order } from './src/models/entities/order.entity';
import { OrderItem } from './src/models/entities/orderItem.entity';
import { Review } from './src/models/entities/review.entity';
import { User } from './src/models/entities/user.entity';
import { Vinyl } from './src/models/entities/vinyl.entity';
import { ReviewSubscriber } from './src/models/entities/review.subscriber';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow<number>('POSTGRES_PORT'),
  database: configService.getOrThrow('POSTGRES_DB'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  migrations: ['./src/data/migrations/**'],
  entities: [User, Vinyl, Order, OrderItem, Review, ReviewSubscriber],
  subscribers: [ReviewSubscriber],
});
