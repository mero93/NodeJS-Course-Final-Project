import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { User } from './user.entity.js';

@Entity()
export class OAuthAccount extends AbstractEntity<OAuthAccount> {
  @Column({ type: 'varchar', length: 255 })
  provider: string;

  @Column({ type: 'varchar', length: 255 })
  providerAccountId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  /// Relation
  @ManyToOne(() => User, (user) => user.OAuthAccounts)
  user: Relation<User>;
}
