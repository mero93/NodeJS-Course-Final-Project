import { Column, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { OrderItem } from './orderItem.entity';
import { User } from './user.entity';

export class Order extends AbstractEntity<Order> {
  @Column({ type: 'int' })
  totalItemCount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  orderTotal: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /// Relationships
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
