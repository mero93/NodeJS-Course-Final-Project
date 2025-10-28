import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { VinylsModule } from './modules/vinyls/vinyls.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module.js';
import { StripeModule } from './stripe/stripe.module.js';
import { MailModule } from './mailer/mail.module.js';
import { DiscogsService } from './discogs/discogs.service.js';
import { DiscogsModule } from './discogs/discogs.module.js';
import { SeederModule } from './seeder/seeder.module.js';

@Module({
  imports: [
    DataModule,
    UsersModule,
    VinylsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    OrdersModule,
    TasksModule,
    StripeModule,
    MailModule,
    DiscogsModule,
    SeederModule,
  ],
  providers: [DiscogsService],
})
export class AppModule {}
