import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Vinyl } from './vinyl.entity';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  vinylId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'varchar', length: 100 })
  vinylName: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  sumPrice: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.orderItems)
  vinyl: Vinyl;
}
