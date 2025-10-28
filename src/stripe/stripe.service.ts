import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(amount: number, orderId: string): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: this.configService.getOrThrow<string>('STRIPE_CURRENCY'),
            product_data: {
              name: `Payment for Order #${orderId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `success.yes`,
      cancel_url: `success.no`,
      metadata: {
        orderId: orderId.toString(),
      },
    });

    return session;
  }

  constructWebhookEvent(signature: string, body: Buffer): Stripe.Event {
    const webhookSecret = this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
  }
}
