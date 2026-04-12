import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { SessionEntity } from '@ccmonit/domain/entities/session.js';
import type { SessionStatus } from '@ccmonit/domain/types/session-status.js';
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
    if (event.eventKind === 'session.started') {
      const session: SessionEntity = {
        sessionId: event.sessionId,
        status: 'active',
        startedAt: event.occurredAt,
        cwd: asString(event.payload['cwd'], process.cwd()),
        model: asOptionalString(event.payload['model']),
        provider: asOptionalString(event.payload['provider']),
        totalElapsedSec: 0,
        totalIdleSec: 0,
        activeAgentCount: 0,
        activeTaskCount: 0,
        startedAtAccuracy: event.accuracy ?? 'estimated',
        lastEventAt: event.occurredAt,
      };
      await this.sessionStore.save(session);
      return;
    }

    const existing = await this.sessionStore.findById(event.sessionId);
    if (!existing) {
      // session.started 이전에 도착한 이벤트 → 최소 세션 생성
      await this.sessionStore.save({
        sessionId: event.sessionId,
        status: 'detected',
        startedAt: event.occurredAt,
        cwd: '',
        totalElapsedSec: 0,
        totalIdleSec: 0,
        activeAgentCount: 0,
        activeTaskCount: 0,
        startedAtAccuracy: 'estimated',
        lastEventAt: event.occurredAt,
      });
      return;
    }

    const nowMs = this.clock.now().getTime();
    const startedAtMs = new Date(existing.startedAt).getTime();
    const totalElapsedSec = Math.max(0, (nowMs - startedAtMs) / 1000);

    let status: SessionStatus = existing.status;
    let endedAt = existing.endedAt;
    let activeAgentCount = existing.activeAgentCount;
    let activeTaskCount = existing.activeTaskCount;

    switch (event.eventKind) {
      case 'session.finished': {
        const payloadStatus = asOptionalString(event.payload['status']);
        status = isSessionTerminal(payloadStatus) ? payloadStatus : 'completed';
        endedAt = event.occurredAt;
        break;
      }
      case 'agent.started':
        activeAgentCount = existing.activeAgentCount + 1;
        break;
      case 'agent.updated':
        if (isAgentFinished(event.payload['status'])) {
          activeAgentCount = Math.max(0, existing.activeAgentCount - 1);
        }
        break;
      case 'task.started':
        activeTaskCount = existing.activeTaskCount + 1;
        break;
      case 'task.updated':
        if (isTaskTerminal(event.payload['status'])) {
          activeTaskCount = Math.max(0, existing.activeTaskCount - 1);
        }
        break;
    }

    await this.sessionStore.save({
      ...existing,
      status,
      endedAt,
      totalElapsedSec,
      activeAgentCount,
      activeTaskCount,
      lastEventAt: event.occurredAt,
      model: existing.model || asOptionalString(event.payload['model']),
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
