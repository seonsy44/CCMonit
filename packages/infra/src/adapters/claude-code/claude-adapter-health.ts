export type AdapterHealthStatus = 'healthy' | 'degraded' | 'disconnected';

export interface AdapterHealthSnapshot {
  readonly adapterId: string;
  readonly status: AdapterHealthStatus;
  readonly lastEventAt: string | null;
  readonly consecutiveErrors: number;
  readonly totalEventsProcessed: number;
  readonly totalParseFailures: number;
  readonly uptimeMs: number;
}

/**
 * Claude Code 어댑터의 헬스 상태를 추적한다.
 *
 * - 이벤트 수신 성공/실패를 기록하여 현재 상태를 판정한다.
 * - 연속 에러 횟수와 마지막 이벤트 시각 기반으로 상태를 결정한다.
 * - adapter.health.updated 이벤트 발행의 근거 데이터를 제공한다.
 *
 * 상태 전이:
 * - healthy: 연속 에러 0, 최근 이벤트 수신
 * - degraded: 연속 에러 1~4, 또는 마지막 이벤트가 오래됨
 * - disconnected: 연속 에러 5+, 또는 이벤트 수신 없이 시간 초과
 */
export class ClaudeAdapterHealth {
  private readonly adapterId: string;
  private status: AdapterHealthStatus = 'healthy';
  private lastEventAt: string | null = null;
  private consecutiveErrors = 0;
  private totalEventsProcessed = 0;
  private totalParseFailures = 0;
  private readonly startedAt: number;

  private readonly degradedThreshold: number;
  private readonly disconnectedThreshold: number;
  private readonly staleTimeoutMs: number;

  constructor(
    adapterId: string,
    options?: {
      degradedThreshold?: number;
      disconnectedThreshold?: number;
      staleTimeoutMs?: number;
    },
  ) {
    this.adapterId = adapterId;
    this.degradedThreshold = options?.degradedThreshold ?? 3;
    this.disconnectedThreshold = options?.disconnectedThreshold ?? 5;
    this.staleTimeoutMs = options?.staleTimeoutMs ?? 60_000;
    this.startedAt = Date.now();
  }

  /** 이벤트 정상 수신 시 호출 */
  recordSuccess(): void {
    this.consecutiveErrors = 0;
    this.totalEventsProcessed++;
    this.lastEventAt = new Date().toISOString();
    this.recalculate();
  }

  /** 파싱 실패 시 호출 */
  recordParseFailure(): void {
    this.totalParseFailures++;
    this.consecutiveErrors++;
    this.recalculate();
  }

  /** 에러 발생 시 호출 */
  recordError(): void {
    this.consecutiveErrors++;
    this.recalculate();
  }

  /** 현재 헬스 스냅샷 */
  snapshot(): AdapterHealthSnapshot {
    this.recalculate();
    return {
      adapterId: this.adapterId,
      status: this.status,
      lastEventAt: this.lastEventAt,
      consecutiveErrors: this.consecutiveErrors,
      totalEventsProcessed: this.totalEventsProcessed,
      totalParseFailures: this.totalParseFailures,
      uptimeMs: Date.now() - this.startedAt,
    };
  }

  private recalculate(): void {
    if (this.consecutiveErrors >= this.disconnectedThreshold) {
      this.status = 'disconnected';
      return;
    }

    if (this.consecutiveErrors >= this.degradedThreshold) {
      this.status = 'degraded';
      return;
    }

    // 마지막 이벤트가 오래되었으면 degraded
    if (this.lastEventAt) {
      const elapsed = Date.now() - new Date(this.lastEventAt).getTime();
      if (elapsed > this.staleTimeoutMs) {
        this.status = 'degraded';
        return;
      }
    }

    this.status = 'healthy';
  }
}
