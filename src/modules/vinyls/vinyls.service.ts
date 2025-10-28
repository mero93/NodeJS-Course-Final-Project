import { Injectable, Logger, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Genre, Style, Vinyl } from '../../models/entities/vinyl.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../models/entities/review.entity.js';
import { VinylModel } from '../../models/interfaces/vinyl.interface.js';
import { CreateVinylDto, UpdateVinylDto } from '../../models/dtos/vinyl.dto.js';
import { Author } from '../../models/entities/author.entity.js';
import { DiscogsService } from '../../discogs/discogs.service.js';
import { GetReleaseResponse } from '@lionralfs/discogs-client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class VinylsService {
  constructor(
    @InjectRepository(Vinyl) private readonly vinylRepository: Repository<Vinyl>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    private readonly discogsService: DiscogsService
  ) {}

  async findAll(userId?: number): Promise<VinylModel[]> {
    const queryBuilder = this.vinylRepository
      .createQueryBuilder('vinyl')
      .leftJoinAndSelect('vinyl.authors', 'author')
      .leftJoinAndSelect('vinyl.genres', 'genre')
      .leftJoinAndSelect('vinyl.styles', 'style');

    const firstReviewSubQuery = this.reviewRepository
      .createQueryBuilder('r')
      .select(['r.vinylId', 'r.userId'])
      .where(
        `(r."vinylId", r."userId") IN (
          SELECT "vinylId", "userId" FROM (
            SELECT "vinylId", "userId", ROW_NUMBER() OVER (PARTITION BY "vinylId" ORDER BY "createdAt" ASC) as rn
            FROM review
            ${userId ? 'WHERE "userId" != :userId' : ''}
          ) as ranked_reviews WHERE rn = 1
        )`,
        { userId }
      );

    queryBuilder.leftJoinAndSelect(
      'vinyl.reviews',
      'review',
      `("review"."vinylId", "review"."userId") IN (${firstReviewSubQuery.getQuery()})`
    );
    queryBuilder.leftJoinAndSelect('review.user', 'reviewUser');
    queryBuilder.setParameters(firstReviewSubQuery.getParameters());

    const vinyls = await queryBuilder.getMany();

    return vinyls.map((vinyl) => ({
      ...vinyl,
      authors: vinyl.authors.map((a) => a.name),
      genres: vinyl.genres.map((g) => g.name),
      styles: vinyl.styles.map((s) => s.name),
      reviews: vinyl.reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        vinylId: r.vinylId,
        userName: r.user.name,
        userLastName: r.user.lastName,
        userAvatar: r.user.avatar,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    }));
  }

  async createVinyl(vinylDto: CreateVinylDto): Promise<VinylModel> {
    const authors = vinylDto.authors.map((name) => ({ name }));
    const genres = vinylDto.genres.map((name) => ({ name }));
    const styles = vinylDto.styles.map((name) => ({ name }));

    const newVinyl = this.vinylRepository.create({
      ...vinylDto,
      authors,
      genres,
      styles,
    });

    const savedVinyl = await this.vinylRepository.save(newVinyl);

    return {
      ...savedVinyl,
      reviews: [],
      authors: vinylDto.authors,
      genres: vinylDto.genres,
      styles: vinylDto.styles,
    };
  }

  async updateVinyl(vinylDto: UpdateVinylDto): Promise<VinylModel> {
    const { authors, genres, styles, ...restOfDto } = vinylDto;

    const vinyl = await this.vinylRepository.preload(restOfDto);

    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }

    if (authors) {
      vinyl.authors = authors.map((name) => ({ name })) as Author[];
    }
    if (genres) {
      vinyl.genres = genres.map((name) => ({ name })) as Genre[];
    }
    if (styles) {
      vinyl.styles = styles.map((name) => ({ name })) as Style[];
    }

    const updatedVinyl = await this.vinylRepository.save(vinyl);

    return {
      ...updatedVinyl,
      authors: updatedVinyl.authors.map((a) => a.name),
      genres: updatedVinyl.genres.map((g) => g.name),
      styles: updatedVinyl.styles.map((s) => s.name),
      reviews: [],
    };
  }

  async deleteVinyl(vinylId: number): Promise<void> {
    const vinyl = await this.vinylRepository.findOne({ where: { id: vinylId } });

    if (!vinyl) {
      throw new NotFoundException('Vinyl not found');
    }

    await this.vinylRepository.remove(vinyl);
  }

  async scrapeVinylsFromDiscogs(
    page: number,
    perPage: number
  ): Promise<{ created: number; failed: number }> {
    const searchResults = await this.discogsService.searchReleases(page, perPage);

    const releaseDetailPromises = searchResults.results.map((result) =>
      this.discogsService.getRelease(result.id).catch((err) => {
        return null;
      })
    );

    const releaseDetailsResponses = await Promise.all(releaseDetailPromises);

    // Filter out nulls
    const successfulReleases = releaseDetailsResponses
      .filter((response) => response && response.data)
      .map((response) => response!.data);

    const validationPipe = new ValidationPipe({ skipMissingProperties: false, whitelist: true });
    let createdCount = 0;

    for (const release of successfulReleases) {
      const createDto = this.mapDiscogsReleaseToDto(release);
      try {
        await validationPipe.transform(createDto, { type: 'body', metatype: CreateVinylDto });

        await this.createVinyl(createDto);

        createdCount++;
      } catch {
        // Skipping if failed validation
      }
    }

    const result = {
      created: createdCount,
      failed: searchResults.results.length - createdCount,
    };

    return result;
  }

  private mapDiscogsReleaseToDto(release: GetReleaseResponse): CreateVinylDto {
    return plainToInstance(CreateVinylDto, {
      name: release.title,
      description: release.notes,
      price: 0,
      inStock: 0,
      releaseDate: release.released ? new Date(release.released) : undefined,
      image: release.images?.[0]?.resource_url,
      authors: release.artists?.map((artist) => artist.name) ?? [],
      genres: release.genres ?? [],
      styles: release.styles ?? [],
      discogId: release.id,
      ratingDiscogAvg: release.community?.rating?.average,
      ratingDiscogCount: release.community?.rating?.count,
    });
  }
}
