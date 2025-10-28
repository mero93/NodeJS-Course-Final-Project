import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from '../../models/entities/order.entity.js';
import { Vinyl } from '../../models/entities/vinyl.entity.js';
import Stripe from 'stripe';
import { StripeService } from '../../stripe/stripe.service.js';
import { MailService } from '../../mailer/mail.service.js';
import { User } from '../../models/entities/user.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Vinyl)
    private readonly vinylRepository: Repository<Vinyl>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService
  ) {}

  async createOrderAndCheckoutSession(
    userId: number,
    items: { vinylId: number; quantity: number }[]
  ): Promise<{ url: string }> {
    const { orderId, amount } = await this.createPendingOrder(userId, items);

    const session = await this.stripeService.createCheckoutSession(amount, orderId.toString());

    if (!session.url) {
      throw new BadRequestException('Failed to create checkout session.');
    }

    return { url: session.url };
  }

  private async createPendingOrder(userId: number, items: { vinylId: number; quantity: number }[]) {
    const vinylIds = items.map((item) => item.vinylId);
    const vinyls = await this.vinylRepository.findBy({ id: In(vinylIds) });

    if (vinyls.length !== vinylIds.length) {
      throw new NotFoundException('One or more vinyls not found.');
    }

    // Correctly calculate total amount based on the quantity from the input items
    const totalAmount = items.reduce((sum, item) => {
      const vinyl = vinyls.find((v) => v.id === item.vinylId);
      if (!vinyl || vinyl.inStock < item.quantity) {
        // This check prevents overselling
        throw new BadRequestException(`Not enough stock for vinyl: ${vinyl?.name || item.vinylId}`);
      }
      return sum + (vinyl.price || 0) * item.quantity;
    }, 0);

    const order = await this.orderRepository.save({
      user: { id: userId },
      orderItems: items.map((item) => ({
        vinyl: { id: item.vinylId },
        quantity: item.quantity,
        price: vinyls.find((v) => v.id === item.vinylId)!.price,
        vinylName: vinyls.find((v) => v.id === item.vinylId)!.name,
        sumPrice: vinyls.find((v) => v.id === item.vinylId)!.price * item.quantity,
      })),
      totalItemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      orderTotal: totalAmount,
      status: OrderStatus.PENDING,
    });

    // Return orderId and totaAmount for Stripe
    return { orderId: order.id, amount: Math.round(totalAmount * 100) };
  }

  async handleSuccessfulPayment(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session?.metadata?.orderId;

      if (!orderId) {
        throw new BadRequestException(`Missing metadata. Session ID: ${session.id}`);
      }

      const order = await this.orderRepository.findOne({
        where: { id: parseInt(orderId, 10) },
        relations: ['user'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }
      order.status = OrderStatus.SUCCESS;
      await this.orderRepository.save(order);

      // Send confirmation email
      if (order.user) {
        await this.mailService.sendPaymentInfo(
          {
            name: order.user.name,
            lastName: order.user.lastName,
            email: order.user.email,
          },
          order
        );
      }
    }
    return { received: true };
  }

  async getPurchaseHistory(userId: number) {
    return this.orderRepository.find({
      where: { userId: userId, status: OrderStatus.SUCCESS },
      order: { createdAt: 'DESC' },
    });
  }
}
