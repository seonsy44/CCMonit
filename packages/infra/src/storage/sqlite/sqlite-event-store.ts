import type { EventStorePort } from '@ccmonit/application/ports/event-store.port.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { EventKind } from '@ccmonit/domain/types/event-kind.js';
import type { EntityType } from '@ccmonit/domain/types/entity-type.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { SqliteDatabase } from './types.js';

/** SQLite events 테이블 행 타입 */
interface EventRow {
  event_id: string;
  event_kind: string;
  session_id: string;
  occurred_at: string;
  entity_type: string;
  entity_id: string;
  parent_id: string | null;
  accuracy: string | null;
  confidence_score: number | null;
  payload: string;
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS events (
    event_id       TEXT PRIMARY KEY,
    event_kind     TEXT NOT NULL,
    session_id     TEXT NOT NULL,
    occurred_at    TEXT NOT NULL,
    entity_type    TEXT NOT NULL,
    entity_id      TEXT NOT NULL,
    parent_id      TEXT,
    accuracy       TEXT,
    confidence_score REAL,
    payload        TEXT NOT NULL DEFAULT '{}'
  )
`;

const CREATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id)
`;

const INSERT = `
  INSERT OR IGNORE INTO events
    (event_id, event_kind, session_id, occurred_at, entity_type, entity_id, parent_id, accuracy, confidence_score, payload)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SELECT_BY_SESSION = `
  SELECT * FROM events WHERE session_id = ? ORDER BY occurred_at ASC
`;

/**
 * SQLite 기반 EventStore 구현.
 *
 * - better-sqlite3 인스턴스를 생성자에서 주입받는다.
 * - events 테이블이 없으면 자동 생성한다 (CREATE IF NOT EXISTS).
 * - INSERT OR IGNORE로 중복 eventId를 안전하게 무시한다.
 * - payload는 JSON 문자열로 직렬화하여 저장한다.
 */
export class SqliteEventStore implements EventStorePort {
  constructor(private readonly db: SqliteDatabase) {
    this.db.exec(CREATE_TABLE);
    this.db.exec(CREATE_INDEX);
  }

  async append(event: EventEntity): Promise<void> {
    this.db.prepare(INSERT).run(
      event.eventId,
      event.eventKind,
      event.sessionId,
      event.occurredAt,
      event.entityType,
      event.entityId,
      event.parentId ?? null,
      event.accuracy ?? null,
      event.confidenceScore ?? null,
      JSON.stringify(event.payload),
    );
  }

  async appendMany(events: EventEntity[]): Promise<void> {
    const stmt = this.db.prepare(INSERT);
    for (const e of events) {
      stmt.run(
        e.eventId,
        e.eventKind,
        e.sessionId,
        e.occurredAt,
        e.entityType,
        e.entityId,
        e.parentId ?? null,
        e.accuracy ?? null,
        e.confidenceScore ?? null,
        JSON.stringify(e.payload),
      );
    }
  }

  async listBySession(sessionId: string): Promise<EventEntity[]> {
    const rows = this.db
      .prepare<EventRow>(SELECT_BY_SESSION)
      .all(sessionId) as EventRow[];

    return rows.map(rowToEntity);
  }
}

// ── helpers ──────────────────────────────────────────────────

function rowToEntity(row: EventRow): EventEntity {
  return {
    eventId: row.event_id,
    eventKind: row.event_kind as EventKind,
    sessionId: row.session_id,
    occurredAt: row.occurred_at,
    entityType: row.entity_type as EntityType,
    entityId: row.entity_id,
    parentId: row.parent_id ?? undefined,
    accuracy: (row.accuracy as TokenAccuracy) ?? undefined,
    confidenceScore: row.confidence_score ?? undefined,
    payload: JSON.parse(row.payload) as Record<string, unknown>,
  };
}
