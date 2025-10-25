import { Column, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Review } from './review.entity';
import { Order } from './order.entity';
import { OAuthAccount } from './oAuthAccount.entity';

export class User extends AbstractEntity<User> {
  // Note: I'm assuming AbstractEntity is not decorated with @Entity()
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
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => OAuthAccount, (oAuthAccount) => oAuthAccount.user)
  oAuthAccounts: OAuthAccount[];
}
