import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { User } from './user.entity.js';

export enum OrderStatus {
  PENDING = 'pending',
  SUCCESS = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Order extends AbstractEntity<Order> {
  @Column({ type: 'int' })
  totalItemCount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  orderTotal: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  /// Relationships
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: Relation<OrderItem>[];

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: Relation<User>;
}
