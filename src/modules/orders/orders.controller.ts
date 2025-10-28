import { Body, Controller, Get, Post, UseGuards, Req, Headers, Param } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { AccessAuthGuard } from '../auth/auth.guard.js';
import { AuthRequest } from '../../models/interfaces/user.interface.js';
import { StripeService } from '../../stripe/stripe.service.js';
import { RawBody } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly stripeService: StripeService
  ) {}

  @Get('purchase-history')
  @UseGuards(AccessAuthGuard)
  async purchaseHistory(@Req() req: AuthRequest) {
    return this.orderService.getPurchaseHistory(req.user!.id);
  }

  @Post('create-checkout-session')
  @UseGuards(AccessAuthGuard)
  async createCheckoutSession(
    @Req() req: AuthRequest,
    @Body() body: { vinylId: number; quantity: number }[]
  ) {
    return this.orderService.createOrderAndCheckoutSession(req.user!.id, body);
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() body: Buffer
  ) {
    const event = this.stripeService.constructWebhookEvent(signature, body);
    return this.orderService.handleSuccessfulPayment(event);
  }
}
