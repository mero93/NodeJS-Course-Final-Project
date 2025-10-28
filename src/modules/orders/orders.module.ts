import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../models/entities/order.entity.js';
import { Vinyl } from '../../models/entities/vinyl.entity.js';
import { StripeModule } from '../../stripe/stripe.module.js';
import { MailModule } from '../../mailer/mail.module.js';
import { User } from '../../models/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Vinyl, User]), StripeModule, MailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
