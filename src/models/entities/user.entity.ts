import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { Review } from './review.entity.js';
import { Order } from './order.entity.js';
import { OAuthAccount } from './OAuthAccount.entity.js';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  avatar: string;

  @Column({ type: 'boolean', default: false })
  isOAuthUser: boolean;

  /// Relationships
  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order>[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review>[];

  @OneToMany(() => OAuthAccount, (oAuthAccount) => oAuthAccount.user)
  OAuthAccounts: Relation<OAuthAccount>[];
}
