import type { EventEntity } from '@ccmonit/domain/entities/event.js';

export interface SessionMetrics {
  readonly totalEvents: number;
  readonly eventsByKind: ReadonlyMap<string, number>;
  readonly eventsPerMinute: number;
  readonly uniqueAgentCount: number;
  readonly uniqueToolCount: number;
  readonly toolCallCount: number;
  readonly firstEventAt: string | null;
  readonly lastEventAt: string | null;
  readonly spanMs: number;
}

/**
 * 이벤트 스트림에서 세션 수준 메트릭을 계산한다.
 *
 * - 이벤트 종류별 카운트, 분당 이벤트 수, 도구 사용 통계 등을 산출한다.
 * - projector/usecase에서 호출하여 read model에 반영한다.
 * - 토큰 관련 집계는 domain의 TokenAggregationService가 담당하므로 여기선 이벤트 통계만 다룬다.
 */
export class MetricsCalculator {
  calculate(events: readonly EventEntity[]): SessionMetrics {
    if (events.length === 0) {
      return {
        totalEvents: 0,
        eventsByKind: new Map(),
        eventsPerMinute: 0,
        uniqueAgentCount: 0,
        uniqueToolCount: 0,
        toolCallCount: 0,
        firstEventAt: null,
        lastEventAt: null,
        spanMs: 0,
      };
    }

    const byKind = new Map<string, number>();
    const agents = new Set<string>();
    const tools = new Set<string>();
    let toolCallCount = 0;

    for (const e of events) {
      byKind.set(e.eventKind, (byKind.get(e.eventKind) ?? 0) + 1);

      if (e.entityType === 'agent') {
        agents.add(e.entityId);
      }

      if (e.eventKind === 'tool.started') {
        toolCallCount++;
        const toolName = e.payload?.tool_name;
        if (typeof toolName === 'string') {
          tools.add(toolName);
        }
      }
    }

    const firstAt = events[0].occurredAt;
    const lastAt = events[events.length - 1].occurredAt;
    const spanMs =
      new Date(lastAt).getTime() - new Date(firstAt).getTime();
    const spanMinutes = Math.max(spanMs / 60_000, 1);

    return {
      totalEvents: events.length,
      eventsByKind: byKind,
      eventsPerMinute: events.length / spanMinutes,
      uniqueAgentCount: agents.size,
      uniqueToolCount: tools.size,
      toolCallCount,
      firstEventAt: firstAt,
      lastEventAt: lastAt,
      spanMs,
    };
  }
}
