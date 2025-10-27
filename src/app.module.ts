import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module.js';
import { UserModule } from './modules/user/user.module.js';
import { VinylModule } from './modules/vinyl/vinyl.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './modules/order/order.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module.js';
import { StripeModule } from './stripe/stripe.module.js';
import { MailModule } from './mailer/mail.module.js';

@Module({
  imports: [
    DataModule,
    UserModule,
    VinylModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    OrderModule,
    TasksModule,
    StripeModule,
    MailModule,
  ],
})
export class AppModule {}
