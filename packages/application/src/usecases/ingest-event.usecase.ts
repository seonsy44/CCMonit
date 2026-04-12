import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { EventStorePort } from '../ports/event-store.port.js';

export interface IngestEventInput {
  event: EventEntity;
}

export class IngestEventUsecase {
  constructor(private readonly eventStore: EventStorePort) {}

  async execute(input: IngestEventInput): Promise<void> {
    await this.eventStore.append(input.event);
  }
}
