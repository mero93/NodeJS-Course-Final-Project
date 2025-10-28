import { MigrationInterface, QueryRunner } from 'typeorm';
import { SeederService } from '../../seeder/seeder.service.js';
import { Review } from '../../models/entities/review.entity.js';
import { Vinyl } from '../../models/entities/vinyl.entity.js';
import { User } from '../../models/entities/user.entity.js';
import { Author } from '../../models/entities/author.entity.js';
import { Genre } from '../../models/entities/vinyl.entity.js';
import { Style } from '../../models/entities/vinyl.entity.js';

export class SEED1761680612750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const seederService = new SeederService();
    await seederService.seed(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const reviewRepository = queryRunner.manager.getRepository(Review);
    const vinylRepository = queryRunner.manager.getRepository(Vinyl);
    const userRepository = queryRunner.manager.getRepository(User);
    const authorRepository = queryRunner.manager.getRepository(Author);
    const genreRepository = queryRunner.manager.getRepository(Genre);
    const styleRepository = queryRunner.manager.getRepository(Style);

    await reviewRepository.delete({});
    await vinylRepository.delete({});
    await userRepository.delete({});
    await authorRepository.delete({});
    await genreRepository.delete({});
    await styleRepository.delete({});
  }
}
