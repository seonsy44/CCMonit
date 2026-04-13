import type { EventLogItem } from '@ccmonit/application/dto/event-log-item.dto.js';

export interface EventLogViewModel {
  readonly eventId: string;
  readonly eventKind: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly timeText: string;
}

export class EventLogPresenter {
  toViewModels(items: readonly EventLogItem[]): EventLogViewModel[] {
    return items.map((e) => ({
      eventId: e.eventId.length > 8 ? e.eventId.slice(0, 8) : e.eventId,
      eventKind: e.eventKind,
      entityType: e.entityType,
      entityId: e.entityId.length > 8 ? e.entityId.slice(0, 8) : e.entityId,
      timeText: new Date(e.occurredAt).toLocaleTimeString(),
    }));
  }
}
