import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Review } from './review.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Vinyl extends AbstractEntity<Vinyl> {
  // Note: I'm assuming AbstractEntity is not decorated with @Entity()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @OneToMany(() => Review, (review) => review.vinyl)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.vinyl)
  orderItems: OrderItem[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  averageRating: number;
}
