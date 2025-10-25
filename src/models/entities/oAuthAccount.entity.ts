import { Column, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';

export class OAuthAccount extends AbstractEntity<OAuthAccount> {
  @Column({ type: 'varchar', length: 255 })
  provider: string;

  @Column({ type: 'varchar', length: 255 })
  providerAccountId: string;

  @ManyToOne(() => User, (user) => user.oAuthAccounts)
  user: User;
}
