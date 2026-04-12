import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';

/**
 * 인메모리 SessionStore 구현.
 *
 * - 개발/테스트 및 단일 세션 모니터링 시 사용한다.
 * - 프로세스 종료 시 데이터가 유실되므로, 장기 보관이 필요하면 SQLite 또는 파일 기반 저장소를 사용한다.
 * - startedAt 기준 내림차순 정렬로 최근 세션부터 반환한다.
 */
export class MemorySessionStore implements SessionStorePort {
  private readonly sessions = new Map<string, SessionEntity>();

  async save(session: SessionEntity): Promise<void> {
    this.sessions.set(session.sessionId, session);
  }

  async findById(sessionId: SessionId): Promise<SessionEntity | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async listRecent(limit = 20): Promise<readonly SessionEntity[]> {
    const all = Array.from(this.sessions.values());
    all.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    return all.slice(0, limit);
  }

  /** 저장소 크기 */
  get size(): number {
    return this.sessions.size;
  }

  /** 전체 초기화 */
  clear(): void {
    this.sessions.clear();
  }
}
