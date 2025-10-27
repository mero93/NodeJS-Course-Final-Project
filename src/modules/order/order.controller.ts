import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('purchase-history/:userId')
  @UseGuards(AccessAuthGuard)
  purchaseHistory() {
    // Should return orders of a user, only successful ones
  }

  @Post('create-checkout-session')
  @UseGuards(AccessAuthGuard)
  createCheckoutSession(@Body() body: { productId: number; quantity: number }[]) {
    // Should implement stripe
    // Should create order from orderItems. Should get items, values, calculate, etc...
    // Should implement it according to blogpost on medium.com
  }

  @Post('webhook')
  async handleStripeWebhook() {
    // Will come up with logic later
    // Need to call mail.service to send email to recipient after resolution
  }
}
