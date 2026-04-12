import type { EventSourcePort } from '../ports/event-source.port.js';

export class StopMonitoringUsecase {
  constructor(private readonly eventSource: EventSourcePort) {}

  async execute(): Promise<void> {
    await this.eventSource.stop();
  }
}
