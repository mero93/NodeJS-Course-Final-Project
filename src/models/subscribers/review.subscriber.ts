import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Review } from '../entities/review.entity.js';
import { Vinyl } from '../entities/vinyl.entity.js';

@EventSubscriber()
export class ReviewSubscriber implements EntitySubscriberInterface<Review> {
  listenTo() {
    return Review;
  }

  async afterInsert(event: InsertEvent<Review>) {
    await this.updateAverageRating(event.manager, event.entity.vinylId);
  }

  async afterUpdate(event: UpdateEvent<Review>) {
    if (event.entity) {
      await this.updateAverageRating(event.manager, (event.entity as Review).vinylId);
    }
  }

  async afterRemove(event: RemoveEvent<Review>) {
    if (event.databaseEntity) {
      await this.updateAverageRating(event.manager, event.databaseEntity.vinylId);
    }
  }

  private async updateAverageRating(manager: EntityManager, vinylId: number) {
    console.log(`Updating rating average and count for Vinyl with ID ${vinylId}`);

    const ratingStats = await manager
      .getRepository(Review)
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.rating)', 'count')
      .where('review.vinylId = :vinylId', { vinylId })
      .getRawOne<{ avg: string | null; count: string }>();

    const ratingAvg = parseFloat(ratingStats?.avg || '0');
    const ratingCount = parseInt(ratingStats?.count || '0', 10);

    await manager.getRepository(Vinyl).update(vinylId, { ratingAvg, ratingCount });
  }
}
