import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { Review } from './review.entity.js';
import { OrderItem } from './orderItem.entity.js';
import { Author } from './author.entity.js';

@Entity()
export class Vinyl extends AbstractEntity<Vinyl> {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 5000 })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({
    type: 'int',
    default: 0,
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
    type: 'int',
    unique: true,
    nullable: true,
    default: null,
  })
  discogId: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  outOfStockAt: Date;

  /// Relationships
  @OneToMany(() => Review, (review) => review.vinyl)
  reviews: Relation<Review>[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.vinyl)
  orderItems: Relation<OrderItem>[];

  @ManyToMany(() => Author, (author) => author.vinyls, { cascade: true, eager: true })
  @JoinTable()
  authors: Relation<Author>[];

  @ManyToMany(() => Style, (style) => style.vinyls, { cascade: true, eager: true })
  @JoinTable()
  styles: Relation<Style>[];

  @ManyToMany(() => Genre, (genre) => genre.vinyls, { cascade: true, eager: true })
  @JoinTable()
  genres: Relation<Genre>[];
}

@Entity()
export class Genre {
  @PrimaryColumn()
  name: string;

  constructor(entity: Partial<Genre>) {
    Object.assign(this, entity);
  }

  /// Relationships
  @ManyToMany(() => Vinyl, (vinyl) => vinyl.genres)
  vinyls: Relation<Vinyl>[];
}

@Entity()
export class Style {
  @PrimaryColumn()
  name: string;

  constructor(entity: Partial<Style>) {
    Object.assign(this, entity);
  }

  /// Relationships
  @ManyToMany(() => Vinyl, (vinyl) => vinyl.styles)
  vinyls: Relation<Vinyl>[];
}
