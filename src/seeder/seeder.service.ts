import { Injectable, Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { FullInfoUser } from '../models/interfaces/user.interface.js';
import { VinylModel } from '../models/interfaces/vinyl.interface.js';
import { QueryRunner } from 'typeorm';
import { User, UserRole } from '../models/entities/user.entity.js';
import { Genre, Style, Vinyl } from '../models/entities/vinyl.entity.js';
import { Review } from '../models/entities/review.entity.js';
import { Author } from '../models/entities/author.entity.js';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  private async generateUsers(count: number) {
    const users: FullInfoUser[] = [];
    const hashedPassword = await bcrypt.hash('password', 10);

    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        birthDate: faker.date.birthdate(),
        avatar: faker.image.avatar(),
        roles: [{ role: 'user' } as UserRole],
      });
    }
    return users;
  }

  private generateUniqueNames(count: number, type: 'author' | 'genre' | 'style'): string[] {
    const names = new Set<string>();
    while (names.size < count) {
      let instance = '';
      switch (type) {
        case 'genre':
          instance = faker.music.genre();
          break;
        case 'author':
          instance = faker.person.fullName();
          break;
        case 'style':
          instance = faker.lorem.words(2);
          break;
        default:
          break;
      }
      names.add(instance);
    }
    return Array.from(names);
  }

  private generateVinyls(
    count: number,
    authorNames: string[],
    genreNames: string[],
    styleNames: string[]
  ) {
    const vinyls: Omit<VinylModel, 'id'>[] = [];
    for (let i = 0; i < count; i++) {
      vinyls.push({
        name: faker.music.songName(),
        description: faker.lorem.paragraph(),
        image: faker.image.url(),
        price: parseFloat(faker.commerce.price()),
        inStock: faker.number.int({ min: 0, max: 100 }),
        releaseDate: faker.date.past({ years: 20 }),
        authors: faker.helpers.arrayElements(authorNames, { min: 1, max: 2 }),
        genres: faker.helpers.arrayElements(genreNames, { min: 1, max: 3 }),
        styles: faker.helpers.arrayElements(styleNames, { min: 1, max: 2 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return vinyls;
  }

  public async seed(queryRunner: QueryRunner) {
    const logger = new Logger(SeederService.name);
    logger.log('Starting seeding');

    const userRepository = queryRunner.manager.getRepository(User);
    const vinylRepository = queryRunner.manager.getRepository(Vinyl);
    const authorRepository = queryRunner.manager.getRepository(Author);
    const genreRepository = queryRunner.manager.getRepository(Genre);
    const styleRepository = queryRunner.manager.getRepository(Style);
    const reviewRepository = queryRunner.manager.getRepository(Review);

    const usersData = await this.generateUsers(20);
    const authorNames = this.generateUniqueNames(10, 'author');
    const genreNames = this.generateUniqueNames(10, 'genre');
    const styleNames = this.generateUniqueNames(10, 'style');
    const vinylsData = this.generateVinyls(50, authorNames, genreNames, styleNames);

    const savedAuthors = await authorRepository.save(authorNames.map((name) => ({ name })));
    logger.log(`Seeded authors.`);

    const savedGenres = await genreRepository.save(genreNames.map((name) => ({ name })));
    logger.log(`Seeded genres.`);

    const savedStyles = await styleRepository.save(styleNames.map((name) => ({ name })));
    logger.log(`Seeded styles.`);

    const savedUsers = await userRepository.save(usersData);
    logger.log(`Seeded users.`);

    const admin = new User({
      name: 'admin',
      lastName: 'admin',
      email: 'admin@admin.admin',
      password: await bcrypt.hash('password', 10),
      roles: [{ role: 'admin' } as UserRole, { role: 'user' } as UserRole],
    });
    await userRepository.save(admin);
    logger.log('Seeded admin user.');

    const vinylsToCreate = vinylsData.map((vinyl) => {
      const authors = vinyl.authors
        ? (vinyl.authors
            .map((name) => savedAuthors.find((a) => a.name === name))
            .filter(Boolean) as Author[])
        : [];
      const genres = vinyl.genres
        ? (vinyl.genres
            .map((name) => savedGenres.find((g) => g.name === name))
            .filter(Boolean) as Genre[])
        : [];
      const styles = vinyl.styles
        ? (vinyl.styles
            .map((name) => savedStyles.find((s) => s.name === name))
            .filter(Boolean) as Style[])
        : [];

      return vinylRepository.create({ ...vinyl, authors, genres, styles });
    });

    const savedVinyls = await vinylRepository.save(vinylsToCreate);
    logger.log(`Seeding vinyls.`);

    const reviewsToCreate: Partial<Review>[] = [];
    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(savedUsers);
      const vinyl = faker.helpers.arrayElement(savedVinyls);

      const existing = reviewsToCreate.find(
        (r) => r.user?.id === user.id && r.vinyl?.id === vinyl.id
      );
      if (existing) {
        continue;
      }

      reviewsToCreate.push({
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.75 }),
        user: user,
        vinyl: vinyl,
      });
    }

    if (reviewsToCreate.length > 0) {
      await reviewRepository.save(reviewsToCreate);
      logger.log(`Seeding reviews.`);
    }
  }
}
