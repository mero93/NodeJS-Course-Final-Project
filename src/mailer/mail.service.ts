import { Injectable } from '@nestjs/common';
import { TokenUser } from '../models/interfaces/user.js';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Order, orderStatus } from '../models/interfaces/order.js';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendPaymentInfo(user: TokenUser, order: Order) {
    const { name, lastName, email } = user;
    let subject: string, text: string;

    switch (order.status) {
      case orderStatus.successful:
        subject = 'Payment successful';
        text = `Your purchase has been successfully completed.
             Recipient: ${name} ${lastName}
             Products purchased: ${order.totalItemCount}
             Total amount payed: ${order.orderTotal.toFixed(2)} USD`;
        break;
      case orderStatus.failed:
      default:
        subject = 'Payment failed';
        text = `Your purchase has failed.
             Recipient: ${name} ${lastName}`;
        break;
    }

    await this.mailerService.sendMail({
      to: `${name} <${email}>`,
      replyTo: '',
      subject: subject,
      text: text,
    });
  }
}
