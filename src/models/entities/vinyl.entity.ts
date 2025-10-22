import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Review } from './review.entity';
import { OrderItem } from './orderItem.entity';
import { Author } from './author.entity';

export class Vinyl extends AbstractEntity<Vinyl> {
  // Note: I'm assuming AbstractEntity is not decorated with @Entity()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  inStock: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: null,
  })
  ratingAvg: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  ratingCount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: null,
  })
  ratingDiscogAvg: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  ratingDiscogCount: number;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  outOfStockAt: Date;

  /// Relationships
  @OneToMany(() => Review, (review) => review.vinyl)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.vinyl)
  orderItems: OrderItem[];

  @ManyToMany(() => Author, (author) => author.vinyls)
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Style, (style) => style.vinyls)
  @JoinTable()
  styles: Style[];

  @ManyToMany(() => Genre, (genre) => genre.vinyls)
  @JoinTable()
  genres: Genre[];
}

@Entity()
export class Style {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Vinyl, (vinyl) => vinyl.styles)
  vinyls: Vinyl[];
}

@Entity()
export class Genre {
  @PrimaryColumn()
  name: string;

  @ManyToMany(() => Vinyl, (vinyl) => vinyl.genres)
  vinyls: Vinyl[];
}
