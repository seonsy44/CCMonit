import type { EventStorePort } from '@ccmonit/application/ports/event-store.port.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';

/**
 * 인메모리 EventStore 구현.
 *
 * - 개발/테스트 및 단일 세션 모니터링 시 사용한다.
 * - 프로세스 종료 시 데이터가 유실되므로, 장기 보관이 필요하면 NDJSON 또는 SQLite를 사용한다.
 * - sessionId 기준으로 이벤트를 그룹화하여 조회 성능을 유지한다.
 */
export class MemoryEventStore implements EventStorePort {
  private readonly bySession = new Map<string, EventEntity[]>();

  async append(event: EventEntity): Promise<void> {
    let list = this.bySession.get(event.sessionId);
    if (!list) {
      list = [];
      this.bySession.set(event.sessionId, list);
    }
    list.push(event);
  }

  async appendMany(events: EventEntity[]): Promise<void> {
    for (const event of events) {
      await this.append(event);
    }
  }

  async listBySession(sessionId: string): Promise<EventEntity[]> {
    return this.bySession.get(sessionId) ?? [];
  }

  get size(): number {
    let count = 0;
    for (const list of this.bySession.values()) {
      count += list.length;
    }
    return count;
  }

  clear(): void {
    this.bySession.clear();
  }
}
