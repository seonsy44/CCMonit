import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { SessionStatus } from '@ccmonit/domain/types/session-status.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { EventStorePort } from '../ports/event-store.port.js';
import type { SessionStorePort } from '../ports/session-store.port.js';
import type { ClockPort } from '../ports/clock.port.js';

export interface IngestEventInput {
  event: EventEntity;
}

export class IngestEventUsecase {
  constructor(
    private readonly eventStore: EventStorePort,
    private readonly sessionStore: SessionStorePort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: IngestEventInput): Promise<void> {
    await this.eventStore.append(input.event);
    await this.projectSession(input.event);
  }

  private async projectSession(event: EventEntity): Promise<void> {
    const existing = await this.sessionStore.findById(event.sessionId);

    // session.started: 새 세션 생성 또는 기존 'detected' 세션 승격
    if (event.eventKind === 'session.started') {
      await this.sessionStore.save({
        sessionId: event.sessionId,
        status: 'active',
        startedAt: event.occurredAt,
        cwd: asString(event.payload['cwd'], process.cwd()),
        model: asOptionalString(event.payload['model']),
        provider: asOptionalString(event.payload['provider']),
        // 이미 누적된 카운트가 있으면 보존한다 (비동기 파일 감시에서
        // sub-agent 이벤트가 session.started보다 먼저 도착할 수 있음)
        totalElapsedSec: existing?.totalElapsedSec ?? 0,
        totalIdleSec: existing?.totalIdleSec ?? 0,
        activeAgentCount: existing?.activeAgentCount ?? 0,
        activeTaskCount: existing?.activeTaskCount ?? 0,
        startedAtAccuracy: event.accuracy ?? 'estimated',
        lastEventAt: event.occurredAt,
      });
      return;
    }

    // 아직 세션이 없으면 'detected' 상태로 생성한 뒤 이벤트 처리를 계속한다
    const session: SessionEntity = existing ?? {
      sessionId: event.sessionId,
      status: 'detected' as SessionStatus,
      startedAt: event.occurredAt,
      cwd: '',
      totalElapsedSec: 0,
      totalIdleSec: 0,
      activeAgentCount: 0,
      activeTaskCount: 0,
      startedAtAccuracy: 'estimated' as TokenAccuracy,
      lastEventAt: event.occurredAt,
    };

    const nowMs = this.clock.now().getTime();
    const startedAtMs = new Date(session.startedAt).getTime();
    const totalElapsedSec = Math.max(0, (nowMs - startedAtMs) / 1000);

    let status: SessionStatus = session.status;
    let endedAt = session.endedAt;
    let activeAgentCount = session.activeAgentCount;
    let activeTaskCount = session.activeTaskCount;

    switch (event.eventKind) {
      case 'session.finished': {
        const payloadStatus = asOptionalString(event.payload['status']);
        status = isSessionTerminal(payloadStatus) ? payloadStatus : 'completed';
        endedAt = event.occurredAt;
        break;
      }
      case 'agent.started':
        activeAgentCount = session.activeAgentCount + 1;
        break;
      case 'agent.updated':
        if (isAgentFinished(event.payload['status'])) {
          activeAgentCount = Math.max(0, session.activeAgentCount - 1);
        }
        break;
      case 'task.started':
        activeTaskCount = session.activeTaskCount + 1;
        break;
      case 'task.updated':
        if (isTaskTerminal(event.payload['status'])) {
          activeTaskCount = Math.max(0, session.activeTaskCount - 1);
        }
        break;
    }

    await this.sessionStore.save({
      ...session,
      status,
      endedAt,
      totalElapsedSec,
      activeAgentCount,
      activeTaskCount,
      lastEventAt: event.occurredAt,
      model: session.model || asOptionalString(event.payload['model']),
    });
  }
}

function asString(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v : fallback;
}

function asOptionalString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

const SESSION_TERMINAL: Set<string> = new Set(['completed', 'interrupted', 'failed']);
function isSessionTerminal(s: unknown): s is SessionStatus {
  return typeof s === 'string' && SESSION_TERMINAL.has(s);
}

const AGENT_FINISHED: Set<string> = new Set(['finished', 'completed', 'failed']);
function isAgentFinished(s: unknown): boolean {
  return typeof s === 'string' && AGENT_FINISHED.has(s);
}

const TASK_TERMINAL: Set<string> = new Set(['completed', 'failed', 'cancelled']);
function isTaskTerminal(s: unknown): boolean {
  return typeof s === 'string' && TASK_TERMINAL.has(s);
}
