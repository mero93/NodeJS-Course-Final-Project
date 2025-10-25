import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Vinyl } from './vinyl.entity';

@Entity()
export class Review {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  vinylId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  /// Relationships
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Vinyl, (vinyl) => vinyl.reviews, { onDelete: 'CASCADE' })
  vinyl: Vinyl;
}
