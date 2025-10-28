import { Injectable } from '@nestjs/common';
import { TokenUser } from '../models/interfaces/user.interface.js';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Order } from '../models/interfaces/order.interface.js';
import { OrderStatus } from '../models/entities/order.entity.js';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendPaymentInfo(user: { name: string; lastName: string; email: string }, order: Order) {
    const { name, lastName, email } = user;
    let subject: string, text: string;

    switch (order.status) {
      case OrderStatus.SUCCESS:
        subject = 'Payment successful';
        text = `Your purchase has been successfully completed.
             Recipient: ${name} ${lastName}
             Products purchased: ${order.totalItemCount}
             Total amount payed: ${order.orderTotal.toFixed(2)} USD`;
        break;
      case OrderStatus.FAILED:
      default:
        subject = 'Payment failed';
        text = `Your purchase has failed miserably.
             Recipient: ${name} ${lastName}`;
        break;
    }

    await this.mailerService.sendMail({
      to: `${name} <${email}>`,
      replyTo: this.configService.getOrThrow<string>('GOOGLE_USERNAME'),
      subject: subject,
      text: text,
    });
  }
}
