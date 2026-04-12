import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { EventStorePort } from '@ccmonit/application/ports/event-store.port.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import { safeJsonParse } from '../../utils/safe-json.js';

/**
 * NDJSON 파일 기반 EventStore 구현.
 *
 * - 세션별로 `{baseDir}/{sessionId}.ndjson` 파일에 append-only로 기록한다.
 * - 저장 모델 doc 권장 디렉터리: `data/events/`
 * - JSON 직렬화 실패 시 해당 이벤트를 건너뛰고 나머지는 계속 처리한다.
 * - listBySession은 전체 파일을 읽으므로, 대용량 세션은 SQLite 사용을 권장한다.
 */
export class NdjsonLogWriter implements EventStorePort {
  constructor(private readonly baseDir: string) {}

  async append(event: EventEntity): Promise<void> {
    const filePath = this.pathFor(event.sessionId);
    await ensureDir(filePath);
    await appendFile(filePath, JSON.stringify(event) + '\n', 'utf8');
  }

  async appendMany(events: EventEntity[]): Promise<void> {
    // 세션별로 그룹화하여 파일 I/O 최소화
    const bySession = new Map<string, EventEntity[]>();
    for (const e of events) {
      let group = bySession.get(e.sessionId);
      if (!group) {
        group = [];
        bySession.set(e.sessionId, group);
      }
      group.push(e);
    }

    for (const [sessionId, batch] of bySession) {
      const filePath = this.pathFor(sessionId);
      await ensureDir(filePath);
      const lines = batch.map((e) => JSON.stringify(e)).join('\n') + '\n';
      await appendFile(filePath, lines, 'utf8');
    }
  }

  async listBySession(sessionId: string): Promise<EventEntity[]> {
    const filePath = this.pathFor(sessionId);
    let content: string;
    try {
      content = await readFile(filePath, 'utf8');
    } catch (err: unknown) {
      if (isNodeError(err) && err.code === 'ENOENT') return [];
      throw err;
    }

    const events: EventEntity[] = [];
    for (const line of content.split('\n')) {
      if (line.length === 0) continue;
      const parsed = safeJsonParse<EventEntity>(line);
      if (parsed) events.push(parsed);
    }
    return events;
  }

  /** 세션 ID에 대응하는 NDJSON 파일 경로 */
  pathFor(sessionId: string): string {
    return join(this.baseDir, `${sessionId}.ndjson`);
  }
}

// ── helpers ──────────────────────────────────────────────────

async function ensureDir(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err;
}
