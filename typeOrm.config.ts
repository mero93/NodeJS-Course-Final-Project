import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Order } from './src/models/entities/order.entity.js';
import { OrderItem } from './src/models/entities/orderItem.entity.js';
import { Review } from './src/models/entities/review.entity.js';
import { User, UserRole } from './src/models/entities/user.entity.js';
import { Genre, Style, Vinyl } from './src/models/entities/vinyl.entity.js';
import { ReviewSubscriber } from './src/models/subscribers/review.subscriber.js';
import { Author } from './src/models/entities/author.entity.js';
import { RevokedToken } from './src/models/entities/revokedToken.entity.js';
import { VinylSubscriber } from './src/models/subscribers/vinyl.subscriber.js';
import { DataSourceOptions } from 'typeorm';
import { OAuthAccount } from './src/models/entities/oAuthAccount.entity.js';

config();

const isProduction = process.env.NODE_ENV === 'production';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: isProduction ? process.env.DATABASE_URL : undefined,
  host: !isProduction ? process.env.POSTGRES_HOST : undefined,
  port: !isProduction ? Number(process.env.POSTGRES_PORT) : undefined,
  database: !isProduction ? process.env.POSTGRES_DB : undefined,
  username: !isProduction ? process.env.POSTGRES_USER : undefined,
  password: !isProduction ? process.env.POSTGRES_PASSWORD : undefined,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  migrations: ['./src/data/migrations/**'],
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
};

export default new DataSource(dataSourceOptions);
