import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { TokenUsageEntity } from '@ccmonit/domain/entities/token-usage.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { TokenAggregationService } from '@ccmonit/domain/services/token-aggregation.service.js';
import type {
  SessionHealthService,
  SessionHealthInput,
} from '@ccmonit/domain/services/session-health.service.js';
import type { EventStorePort } from '../ports/event-store.port.js';
import type { SessionStorePort } from '../ports/session-store.port.js';
import type { ClockPort } from '../ports/clock.port.js';
import type { SessionSummaryDto } from '../dto/session-summary.dto.js';
import type { AgentSummaryItem } from '../dto/agent-summary-item.dto.js';
import type { TaskSummaryItem } from '../dto/task-summary-item.dto.js';
import type { SkillSummaryItem } from '../dto/skill-summary-item.dto.js';
import type { ToolSummaryItem } from '../dto/tool-summary-item.dto.js';
import type { FileActivityItem } from '../dto/file-activity-item.dto.js';
import type { EventLogItem } from '../dto/event-log-item.dto.js';

export interface BuildSessionSummaryInput {
  readonly sessionId: SessionId;
}

export class BuildSessionSummaryUsecase {
  constructor(
    private readonly eventStore: EventStorePort,
    private readonly sessionStore: SessionStorePort,
    private readonly clock: ClockPort,
    private readonly tokenAggregation: TokenAggregationService,
    private readonly sessionHealth: SessionHealthService,
  ) {}

  async execute(input: BuildSessionSummaryInput): Promise<SessionSummaryDto | null> {
    const session = await this.sessionStore.findById(input.sessionId);
    if (!session) return null;

    const events = await this.eventStore.listBySession(input.sessionId);

    // Token aggregation
    const tokenUsages = this.extractTokenUsages(events);
    const tokens = this.tokenAggregation.aggregate(tokenUsages);

    // Entity projections
    const agentSummaries = this.projectAgents(events);
    const taskSummaries = this.projectTasks(events);
    const skillSummaries = this.projectSkills(events);
    const toolSummaries = this.projectTools(events);
    const fileActivities = this.projectFileActivities(events);
    const recentEvents = this.projectRecentEvents(events);

    // Health evaluation
    const alertCount = this.countAlerts(events);
    const healthInput = this.buildHealthInput(session, events, alertCount);
    const health = this.sessionHealth.evaluate(healthInput);

    return {
      sessionId: session.sessionId,
      status: session.status,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      model: session.model,
      cwd: session.cwd,
      totalElapsedSec: session.totalElapsedSec,
      totalIdleSec: session.totalIdleSec,
      activeAgentCount: session.activeAgentCount,
      activeTaskCount: session.activeTaskCount,
      tokens,
      healthLevel: health.level,
      alertCount,
      accuracy: session.startedAtAccuracy,
      agentSummaries,
      taskSummaries,
      skillSummaries,
      toolSummaries,
      fileActivities,
      recentEvents,
    };
  }

  private extractTokenUsages(events: readonly EventEntity[]): TokenUsageEntity[] {
    return events
      .filter((e) => e.eventKind === 'token.updated')
      .map((e) => ({
        tokenUsageId: String(e.payload['tokenUsageId'] ?? e.eventId),
        scopeType: (e.payload['scopeType'] as TokenUsageEntity['scopeType']) ?? 'session',
        scopeId: String(e.payload['scopeId'] ?? e.entityId),
        inputTokens: asOptionalNumber(e.payload['inputTokens']),
        outputTokens: asOptionalNumber(e.payload['outputTokens']),
        cacheReadTokens: asOptionalNumber(e.payload['cacheReadTokens']),
        cacheWriteTokens: asOptionalNumber(e.payload['cacheWriteTokens']),
        totalTokens: asOptionalNumber(e.payload['totalTokens']),
        accuracy: (e.payload['accuracy'] as TokenAccuracy) ?? e.accuracy ?? 'unavailable',
        source: (e.payload['source'] as TokenUsageEntity['source']) ?? 'unknown',
        recordedAt: String(e.payload['recordedAt'] ?? e.occurredAt),
      }));
  }

  private projectAgents(events: readonly EventEntity[]): AgentSummaryItem[] {
    const agentEvents = events.filter((e) => e.entityType === 'agent');

    const byAgent = new Map<string, EventEntity[]>();
    for (const e of agentEvents) {
      const list = byAgent.get(e.entityId) ?? [];
      list.push(e);
      byAgent.set(e.entityId, list);
    }

    const now = this.clock.now();
    const items: AgentSummaryItem[] = [];

    for (const [agentId, agentEvts] of byAgent) {
      const first = agentEvts[0]!;
      const last = agentEvts[agentEvts.length - 1]!;

      const startedAt = new Date(first.occurredAt);
      const elapsedSec = (now.getTime() - startedAt.getTime()) / 1000;

      items.push({
        agentId,
        roleName: String(last.payload['roleName'] ?? agentId),
        status: String(last.payload['status'] ?? 'running'),
        teamId:
          last.payload['teamId'] != null ? String(last.payload['teamId']) : undefined,
        elapsedSec: Math.max(0, Math.floor(elapsedSec)),
        toolCallCount:
          typeof last.payload['toolCallCount'] === 'number'
            ? last.payload['toolCallCount']
            : 0,
        lastActivityAt: last.occurredAt,
      });
    }

    return items;
  }

  private projectTasks(events: readonly EventEntity[]): TaskSummaryItem[] {
    const taskEvents = events.filter((e) => e.entityType === 'task');

    const byTask = new Map<string, EventEntity[]>();
    for (const e of taskEvents) {
      const list = byTask.get(e.entityId) ?? [];
      list.push(e);
      byTask.set(e.entityId, list);
    }

    const now = this.clock.now();
    const items: TaskSummaryItem[] = [];

    for (const [taskId, taskEvts] of byTask) {
      const first = taskEvts[0]!;
      const last = taskEvts[taskEvts.length - 1]!;

      const startedAt = new Date(first.occurredAt);
      const elapsedSec = (now.getTime() - startedAt.getTime()) / 1000;

      items.push({
        taskId,
        title: String(last.payload['title'] ?? taskId),
        status: String(last.payload['status'] ?? 'running'),
        agentId:
          last.payload['agentId'] != null ? String(last.payload['agentId']) : undefined,
        elapsedSec: Math.max(0, Math.floor(elapsedSec)),
        retryCount:
          typeof last.payload['retryCount'] === 'number' ? last.payload['retryCount'] : 0,
        isStuck: last.payload['isStuck'] === true,
      });
    }

    return items;
  }

  private projectSkills(events: readonly EventEntity[]): SkillSummaryItem[] {
    const skillEvents = events.filter((e) => e.entityType === 'skill');

    const bySkill = new Map<string, EventEntity[]>();
    for (const e of skillEvents) {
      const list = bySkill.get(e.entityId) ?? [];
      list.push(e);
      bySkill.set(e.entityId, list);
    }

    const items: SkillSummaryItem[] = [];

    for (const [skillId, skillEvts] of bySkill) {
      const first = skillEvts[0]!;
      const last = skillEvts[skillEvts.length - 1]!;

      items.push({
        skillId,
        skillName: String(last.payload['skill_name'] ?? skillId),
        status: String(last.payload['status'] ?? 'running'),
        taskId:
          last.payload['taskId'] != null ? String(last.payload['taskId']) : undefined,
        startedAt: first.occurredAt,
        toolCallCount:
          typeof last.payload['toolCallCount'] === 'number'
            ? last.payload['toolCallCount']
            : 0,
      });
    }

    return items;
  }

  private projectTools(events: readonly EventEntity[]): ToolSummaryItem[] {
    const toolEvents = events.filter(
      (e) => e.eventKind === 'tool.started' || e.eventKind === 'tool.finished',
    );

    const stats = new Map<string, { calls: number; errors: number }>();

    for (const e of toolEvents) {
      if (e.eventKind !== 'tool.started') continue;
      const toolName = typeof e.payload['tool_name'] === 'string'
        ? e.payload['tool_name']
        : String(e.entityId);
      const entry = stats.get(toolName) ?? { calls: 0, errors: 0 };
      entry.calls++;
      stats.set(toolName, entry);
    }

    // Count errors from tool.finished events
    for (const e of toolEvents) {
      if (e.eventKind !== 'tool.finished') continue;
      const toolName = typeof e.payload['tool_name'] === 'string'
        ? e.payload['tool_name']
        : String(e.entityId);
      if (e.payload['is_error'] === true) {
        const entry = stats.get(toolName);
        if (entry) entry.errors++;
      }
    }

    return Array.from(stats.entries())
      .map(([toolName, s]) => ({
        toolName,
        callCount: s.calls,
        errorCount: s.errors,
      }))
      .sort((a, b) => b.callCount - a.callCount);
  }

  private projectFileActivities(events: readonly EventEntity[]): FileActivityItem[] {
    const fileEvents = events.filter((e) => e.entityType === 'file');

    return fileEvents
      .slice(-20)
      .reverse()
      .map((e) => ({
        filePath: String(e.payload['filePath'] ?? e.entityId),
        action: String(e.payload['action'] ?? 'changed'),
        occurredAt: e.occurredAt,
        agentId:
          e.payload['agentId'] != null ? String(e.payload['agentId']) : undefined,
        taskId:
          e.payload['taskId'] != null ? String(e.payload['taskId']) : undefined,
      }));
  }

  private projectRecentEvents(events: readonly EventEntity[]): EventLogItem[] {
    return events.slice(-50).reverse().map((e) => ({
      eventId: e.eventId,
      eventKind: e.eventKind,
      entityType: e.entityType,
      entityId: e.entityId,
      occurredAt: e.occurredAt,
    }));
  }

  private countAlerts(events: readonly EventEntity[]): number {
    return events.filter((e) => e.eventKind === 'alert.detected').length;
  }

  private buildHealthInput(
    session: {
      status: string;
      totalElapsedSec: number;
      totalIdleSec: number;
      lastEventAt?: string;
    },
    events: readonly EventEntity[],
    alertCount: number,
  ): SessionHealthInput {
    const now = this.clock.now();
    const lastEventAt = session.lastEventAt ? new Date(session.lastEventAt) : null;
    const lastEventAgeSec = lastEventAt
      ? (now.getTime() - lastEventAt.getTime()) / 1000
      : undefined;

    const errorAlerts = events.filter(
      (e) => e.eventKind === 'alert.detected' && e.payload['severity'] === 'error',
    ).length;

    const taskEvents = events.filter((e) => e.entityType === 'task');
    const taskStates = new Map<string, string>();
    for (const e of taskEvents) {
      const status = e.payload['status'];
      if (typeof status === 'string') {
        taskStates.set(e.entityId, status);
      }
    }
    let stuckCount = 0;
    let failedCount = 0;
    for (const status of taskStates.values()) {
      if (status === 'blocked') stuckCount++;
      if (status === 'failed') failedCount++;
    }

    return {
      sessionStatus: session.status as SessionHealthInput['sessionStatus'],
      totalElapsedSec: session.totalElapsedSec,
      totalIdleSec: session.totalIdleSec,
      lastEventAgeSec,
      activeAlertCount: alertCount,
      errorAlertCount: errorAlerts,
      stuckTaskCount: stuckCount,
      failedTaskCount: failedCount,
      totalTaskCount: taskStates.size,
    };
  }
}

function asOptionalNumber(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}
