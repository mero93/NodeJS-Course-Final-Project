import { OrderStatus } from '../entities/order.entity.js';

export interface Order {
  status: OrderStatus;
  totalItemCount: number;
  orderTotal: number;
  createdAt: Date;
}
