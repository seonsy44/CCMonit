import type { EventSourcePort } from '../ports/event-source.port.js';
import type { IngestEventUsecase } from './ingest-event.usecase.js';

export class StartMonitoringUsecase {
  constructor(
    private readonly eventSource: EventSourcePort,
    private readonly ingestEvent: IngestEventUsecase,
  ) {}

  async execute(): Promise<void> {
    this.eventSource.onEvent((event) => this.ingestEvent.execute({ event }));
    await this.eventSource.start();
  }
}
