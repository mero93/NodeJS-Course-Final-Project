import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { Vinyl } from '../entities/vinyl.entity.js';

@EventSubscriber()
export class VinylSubscriber implements EntitySubscriberInterface<Vinyl> {
  listenTo() {
    return Vinyl;
  }

  beforeUpdate(event: UpdateEvent<Vinyl>) {
    if (!event.entity || !event.updatedColumns || event.updatedColumns.length === 0) return;

    console.log(`Vinyl with ID ${event.entity.id} is about to be updated.`);

    // Check if specific columns were updated
    const changedColumnNames = event.updatedColumns.map((c) => c.propertyName);

    if (changedColumnNames.includes('inStock')) {
      if (event.entity.inStock === 0) {
        event.entity.outOfStockAt = new Date();
      } else {
        event.entity.outOfStockAt = null;
      }
    }

    if (changedColumnNames.filter((name) => name !== 'inStock').length > 0) {
      event.entity.updatedAt = new Date();
    }
  }
}
