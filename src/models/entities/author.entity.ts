import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity.js';
import { Vinyl } from './vinyl.entity.js';

@Entity()
export class Author extends AbstractEntity<Author> {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Vinyl, (vinyl) => vinyl.authors)
  @JoinTable()
  vinyls: Vinyl[];
}
