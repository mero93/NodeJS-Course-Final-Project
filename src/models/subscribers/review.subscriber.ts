import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Review } from '../entities/review.entity';
import { Vinyl } from '../entities/vinyl.entity';

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
    console.log(`Updating average rating for Vinyl with ID ${vinylId}`);

    const query: { avg: string } = await manager
      .getRepository(Review)
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.vinylId = :vinylId', { vinylId })
      .getRawOne();

    await manager.getRepository(Vinyl).update(vinylId, { ratingAvg: parseFloat(query.avg) || 0 });
  }
}
