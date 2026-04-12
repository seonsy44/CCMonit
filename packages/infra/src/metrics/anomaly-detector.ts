import type { EventEntity } from '@ccmonit/domain/entities/event.js';

export type AnomalyKind =
  | 'token_spike'
  | 'event_burst'
  | 'long_gap'
  | 'parse_failure_burst'
  | 'tool_retry_loop';

export interface DetectedAnomaly {
  readonly kind: AnomalyKind;
  readonly severity: 'info' | 'warn' | 'error';
  readonly message: string;
  readonly detectedAt: string;
  readonly evidence: Record<string, unknown>;
}

export interface AnomalyDetectorOptions {
  /** token.updated 이벤트 간 토큰 증가량이 이 값을 초과하면 spike. 기본: 50000 */
  readonly tokenSpikeThreshold?: number;
  /** 지정 시간(ms) 내 이벤트 수가 이 값을 초과하면 burst. 기본: 50 */
  readonly eventBurstThreshold?: number;
  /** 지정 시간(ms) 이상 이벤트가 없으면 gap. 기본: 120000 (2분) */
  readonly longGapThresholdMs?: number;
  /** 같은 도구가 연속 N회 이상 호출되면 retry loop. 기본: 5 */
  readonly retryLoopThreshold?: number;
}

const DEFAULTS: Required<AnomalyDetectorOptions> = {
  tokenSpikeThreshold: 50_000,
  eventBurstThreshold: 50,
  longGapThresholdMs: 120_000,
  retryLoopThreshold: 5,
};

/**
 * 이벤트 스트림에서 이상 징후를 탐지한다.
 *
 * - 토큰 급증 (token spike)
 * - 이벤트 폭주 (event burst)
 * - 장시간 무활동 (long gap)
 * - 도구 반복 호출 (retry loop)
 *
 * alerting 모듈과 달리, 여기서는 raw 수치 기반 탐지만 수행하고
 * alert lifecycle(raised/resolved)은 관여하지 않는다.
 */
export class AnomalyDetector {
  private readonly opts: Required<AnomalyDetectorOptions>;

  constructor(options?: AnomalyDetectorOptions) {
    this.opts = { ...DEFAULTS, ...options };
  }

  detect(events: readonly EventEntity[]): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];

    anomalies.push(...this.detectTokenSpikes(events));
    anomalies.push(...this.detectLongGaps(events));
    anomalies.push(...this.detectToolRetryLoops(events));

    return anomalies;
  }

  private detectTokenSpikes(events: readonly EventEntity[]): DetectedAnomaly[] {
    const results: DetectedAnomaly[] = [];
    let prevTotal = 0;

    for (const e of events) {
      if (e.eventKind !== 'token.updated') continue;
      const total = typeof e.payload?.total_tokens === 'number' ? e.payload.total_tokens : 0;

      if (prevTotal > 0) {
        const delta = total - prevTotal;
        if (delta > this.opts.tokenSpikeThreshold) {
          results.push({
            kind: 'token_spike',
            severity: 'warn',
            message: `Token spike: +${delta} tokens in single update`,
            detectedAt: e.occurredAt,
            evidence: { delta, prevTotal, currentTotal: total },
          });
        }
      }
      prevTotal = total;
    }

    return results;
  }

  private detectLongGaps(events: readonly EventEntity[]): DetectedAnomaly[] {
    const results: DetectedAnomaly[] = [];

    for (let i = 1; i < events.length; i++) {
      const prevTime = new Date(events[i - 1].occurredAt).getTime();
      const currTime = new Date(events[i].occurredAt).getTime();
      const gapMs = currTime - prevTime;

      if (gapMs > this.opts.longGapThresholdMs) {
        results.push({
          kind: 'long_gap',
          severity: 'info',
          message: `No events for ${Math.round(gapMs / 1000)}s`,
          detectedAt: events[i].occurredAt,
          evidence: { gapMs, from: events[i - 1].occurredAt, to: events[i].occurredAt },
        });
      }
    }

    return results;
  }

  private detectToolRetryLoops(events: readonly EventEntity[]): DetectedAnomaly[] {
    const results: DetectedAnomaly[] = [];
    let consecutiveToolName = '';
    let consecutiveCount = 0;

    for (const e of events) {
      if (e.eventKind !== 'tool.started') {
        consecutiveToolName = '';
        consecutiveCount = 0;
        continue;
      }

      const toolName = typeof e.payload?.tool_name === 'string' ? e.payload.tool_name : '';

      if (toolName === consecutiveToolName) {
        consecutiveCount++;
        if (consecutiveCount === this.opts.retryLoopThreshold) {
          results.push({
            kind: 'tool_retry_loop',
            severity: 'warn',
            message: `Tool "${toolName}" called ${consecutiveCount} times consecutively`,
            detectedAt: e.occurredAt,
            evidence: { toolName, count: consecutiveCount },
          });
        }
      } else {
        consecutiveToolName = toolName;
        consecutiveCount = 1;
      }
    }

    return results;
  }
}
