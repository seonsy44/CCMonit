import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { SessionStatus } from '@ccmonit/domain/types/session-status.js';
import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { SqliteDatabase } from './types.js';

/** SQLite sessions 테이블 행 타입 */
interface SessionRow {
  session_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  cwd: string;
  model: string | null;
  provider: string | null;
  total_elapsed_sec: number;
  total_idle_sec: number;
  last_event_at: string | null;
  active_agent_count: number;
  active_task_count: number;
  started_at_accuracy: string;
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS sessions (
    session_id           TEXT PRIMARY KEY,
    status               TEXT NOT NULL,
    started_at           TEXT NOT NULL,
    ended_at             TEXT,
    cwd                  TEXT NOT NULL,
    model                TEXT,
    provider             TEXT,
    total_elapsed_sec    REAL NOT NULL DEFAULT 0,
    total_idle_sec       REAL NOT NULL DEFAULT 0,
    last_event_at        TEXT,
    active_agent_count   INTEGER NOT NULL DEFAULT 0,
    active_task_count    INTEGER NOT NULL DEFAULT 0,
    started_at_accuracy  TEXT NOT NULL DEFAULT 'unavailable'
  )
`;

const UPSERT = `
  INSERT INTO sessions
    (session_id, status, started_at, ended_at, cwd, model, provider,
     total_elapsed_sec, total_idle_sec, last_event_at,
     active_agent_count, active_task_count, started_at_accuracy)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(session_id) DO UPDATE SET
    status              = excluded.status,
    ended_at            = excluded.ended_at,
    cwd                 = excluded.cwd,
    model               = excluded.model,
    provider            = excluded.provider,
    total_elapsed_sec   = excluded.total_elapsed_sec,
    total_idle_sec      = excluded.total_idle_sec,
    last_event_at       = excluded.last_event_at,
    active_agent_count  = excluded.active_agent_count,
    active_task_count   = excluded.active_task_count,
    started_at_accuracy = excluded.started_at_accuracy
`;

const SELECT_BY_ID = `
  SELECT * FROM sessions WHERE session_id = ?
`;

const SELECT_RECENT = `
  SELECT * FROM sessions ORDER BY started_at DESC LIMIT ?
`;

/**
 * SQLite 기반 SessionStore 구현.
 *
 * - better-sqlite3 인스턴스를 생성자에서 주입받는다.
 * - sessions 테이블이 없으면 자동 생성한다.
 * - save는 UPSERT (INSERT ... ON CONFLICT DO UPDATE)로 동작하여 세션 상태를 갱신한다.
 */
export class SqliteSessionStore implements SessionStorePort {
  constructor(private readonly db: SqliteDatabase) {
    this.db.exec(CREATE_TABLE);
  }

  async save(session: SessionEntity): Promise<void> {
    this.db.prepare(UPSERT).run(
      session.sessionId,
      session.status,
      session.startedAt,
      session.endedAt ?? null,
      session.cwd,
      session.model ?? null,
      session.provider ?? null,
      session.totalElapsedSec,
      session.totalIdleSec,
      session.lastEventAt ?? null,
      session.activeAgentCount,
      session.activeTaskCount,
      session.startedAtAccuracy,
    );
  }

  async findById(sessionId: SessionId): Promise<SessionEntity | null> {
    const row = this.db
      .prepare<SessionRow>(SELECT_BY_ID)
      .get(sessionId) as SessionRow | undefined;

    return row ? rowToEntity(row) : null;
  }

  async listRecent(limit = 20): Promise<readonly SessionEntity[]> {
    const rows = this.db
      .prepare<SessionRow>(SELECT_RECENT)
      .all(limit) as SessionRow[];

    return rows.map(rowToEntity);
  }
}

// ── helpers ──────────────────────────────────────────────────

function rowToEntity(row: SessionRow): SessionEntity {
  return {
    sessionId: row.session_id,
    status: row.status as SessionStatus,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    cwd: row.cwd,
    model: row.model ?? undefined,
    provider: row.provider ?? undefined,
    totalElapsedSec: row.total_elapsed_sec,
    totalIdleSec: row.total_idle_sec,
    lastEventAt: row.last_event_at ?? undefined,
    activeAgentCount: row.active_agent_count,
    activeTaskCount: row.active_task_count,
    startedAtAccuracy: row.started_at_accuracy as TokenAccuracy,
  };
}
