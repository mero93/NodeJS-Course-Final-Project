import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { User } from './user.entity.js';

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

  /// Relationships
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: Relation<OrderItem>[];

  @ManyToOne(() => User, (user) => user.orders)
  user: Relation<User>;
}
