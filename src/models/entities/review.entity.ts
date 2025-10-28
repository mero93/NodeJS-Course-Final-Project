import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { Vinyl } from './vinyl.entity.js';
import { AbstractEntity } from './abstract.entity.js';

@Entity()
@Unique(['userId', 'vinylId'])
export class Review extends AbstractEntity<Review> {
  @Column()
  userId: number;

  @Column()
  vinylId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /// Relationships
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews, { onDelete: 'CASCADE' })
  vinyl: Relation<Vinyl>;
}
