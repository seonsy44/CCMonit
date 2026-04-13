import { randomUUID } from 'node:crypto';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import type { EventKind } from '@ccmonit/domain/types/event-kind.js';
import type { EntityType } from '@ccmonit/domain/types/entity-type.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import { safeJsonParse } from '../../utils/safe-json.js';
import { ClaudeSessionDetector } from './claude-session-detector.js';
import { ClaudeTokenExtractor } from './claude-token-extractor.js';
import type { RawClaudeLine, RawContentBlock } from './types.js';

const PREVIEW_MAX_LEN = 200;

/**
 * Claude Code JSONL 로그 라인을 canonical EventEntity 배열로 변환하는 메인 파서.
 *
 * 하나의 raw 라인에서 여러 이벤트가 동시에 생성될 수 있다:
 * - session.started: 새 sessionId 최초 등장
 * - agent.started: 새 agentId 최초 등장
 * - tool.started / tool.finished: tool_use / tool_result 콘텐츠 블록
 * - task.started / task.updated: TaskCreate / TaskUpdate 도구 호출
 * - skill.started: Skill 도구 호출
 * - token.updated: assistant 메시지의 usage 필드
 *
 * 파싱 실패한 라인은 빈 배열을 반환하며 예외를 던지지 않는다.
 */
export class ClaudeEventParser {
  private readonly sessionDetector = new ClaudeSessionDetector();
  private readonly tokenExtractor = new ClaudeTokenExtractor();
  private readonly knownAgents = new Set<string>();

  /**
   * raw JSONL 문자열 한 줄을 파싱하여 0개 이상의 EventEntity를 반환한다.
   * 파싱 불가능한 라인은 빈 배열을 반환한다.
   */
  parseLine(raw: string): EventEntity[] {
    const line = safeJsonParse<RawClaudeLine>(raw);
    if (!line?.sessionId) return [];

    try {
      return this.parseValidLine(line);
    } catch {
      // 예상 밖 런타임 에러 — 한 줄 실패가 전체 파이프라인을 중단하면 안 된다
      return [];
    }
  }

  private parseValidLine(line: RawClaudeLine): EventEntity[] {
    const events: EventEntity[] = [];
    const sessionId = line.sessionId!;
    const occurredAt = line.timestamp ?? new Date().toISOString();
    const hasExactTime = typeof line.timestamp === 'string';

    // 1. 세션 감지
    const session = this.sessionDetector.detect(line);
    if (session) {
      events.push(
        this.makeEvent('session.started', 'session', sessionId, {
          sessionId,
          occurredAt: session.startedAt,
          accuracy: session.startedAtAccuracy,
          payload: {
            cwd: session.cwd,
            model: session.model,
            version: session.version,
            started_at_accuracy: session.startedAtAccuracy,
          },
        }),
      );
    }

    // 2. 에이전트 감지
    const agentId = line.agentId;
    if (agentId && !this.knownAgents.has(agentId)) {
      this.knownAgents.add(agentId);
      events.push(
        this.makeEvent('agent.started', 'agent', agentId, {
          sessionId,
          occurredAt,
          parentId: sessionId,
          accuracy: hasExactTime ? 'exact' : 'estimated',
          payload: {
            agent_id: agentId,
            is_sidechain: line.isSidechain ?? false,
          },
        }),
      );
    }

    // 3. 콘텐츠 블록 파싱 (tool_use → tool.started, tool_result → tool.finished)
    const content = line.message?.content;
    if (Array.isArray(content)) {
      for (const block of content as readonly RawContentBlock[]) {
        this.parseContentBlock(block, sessionId, occurredAt, agentId, events);
      }
    }

    // 4. 토큰 사용량 (assistant 메시지만)
    if (line.type === 'assistant') {
      const usage = this.tokenExtractor.extract(line.message);
      if (usage) {
        events.push(
          this.makeEvent('token.updated', 'session', sessionId, {
            sessionId,
            occurredAt,
            parentId: agentId,
            accuracy: usage.accuracy,
            payload: {
              input_tokens: usage.inputTokens,
              output_tokens: usage.outputTokens,
              cache_read_tokens: usage.cacheReadTokens,
              cache_write_tokens: usage.cacheWriteTokens,
              total_tokens: usage.totalTokens,
              source: usage.source,
              model: line.message?.model,
            },
          }),
        );
      }
    }

    return events;
  }

  /** 여러 줄을 한 번에 파싱한다. 편의 메서드. */
  parseLines(lines: readonly string[]): EventEntity[] {
    return lines.flatMap((l) => this.parseLine(l));
  }

  /** 내부 상태 초기화 (세션 전환 또는 테스트 시) */
  reset(): void {
    this.sessionDetector.reset();
    this.knownAgents.clear();
  }

  // ── 콘텐츠 블록 파싱 ──────────────────────────────────────────

  private parseContentBlock(
    block: RawContentBlock,
    sessionId: string,
    occurredAt: string,
    agentId: string | undefined,
    out: EventEntity[],
  ): void {
    if (block.type === 'tool_use' && block.id && block.name) {
      this.handleToolUse(block, sessionId, occurredAt, agentId, out);
    }

    if (block.type === 'tool_result' && block.tool_use_id) {
      out.push(
        this.makeEvent('tool.finished', 'tool', block.tool_use_id, {
          sessionId,
          occurredAt,
          parentId: agentId,
          payload: {
            is_error: block.is_error ?? false,
            output_preview: truncate(extractContentText(block.content)),
          },
        }),
      );
    }
  }

  private handleToolUse(
    block: RawContentBlock,
    sessionId: string,
    occurredAt: string,
    agentId: string | undefined,
    out: EventEntity[],
  ): void {
    const toolId = block.id!;
    const toolName = block.name!;
    const input = block.input ?? {};

    // 모든 tool_use → tool.started
    out.push(
      this.makeEvent('tool.started', 'tool', toolId, {
        sessionId,
        occurredAt,
        parentId: agentId,
        payload: {
          tool_name: toolName,
          args_preview: truncate(JSON.stringify(input)),
        },
      }),
    );

    // 특수 도구 → 상위 도메인 이벤트 추가 생성
    this.emitSemanticEvent(toolName, input, toolId, sessionId, occurredAt, agentId, out);
  }

  /**
   * TaskCreate, TaskUpdate, Skill 등 특수 도구 호출에서 상위 도메인 이벤트를 생성한다.
   * tool.started와 별도로 task.started, skill.started 등을 추가 발행한다.
   */
  private emitSemanticEvent(
    toolName: string,
    input: Record<string, unknown>,
    toolId: string,
    sessionId: string,
    occurredAt: string,
    agentId: string | undefined,
    out: EventEntity[],
  ): void {
    switch (toolName) {
      case 'TaskCreate':
      case 'TodoCreate': {
        out.push(
          this.makeEvent('task.started', 'task', toolId, {
            sessionId,
            occurredAt,
            parentId: agentId,
            confidenceScore: 0.9,
            payload: {
              title: stringOrEmpty(input.subject),
              description: input.description,
              triggered_by_tool: toolId,
            },
          }),
        );
        break;
      }

      case 'TaskUpdate':
      case 'TodoUpdate': {
        const taskEntityId = typeof input.taskId === 'string' ? input.taskId : toolId;
        out.push(
          this.makeEvent('task.updated', 'task', taskEntityId, {
            sessionId,
            occurredAt,
            parentId: agentId,
            confidenceScore: 0.9,
            payload: {
              status: input.status,
              triggered_by_tool: toolId,
            },
          }),
        );
        break;
      }

      case 'Skill': {
        out.push(
          this.makeEvent('skill.started', 'skill', toolId, {
            sessionId,
            occurredAt,
            parentId: agentId,
            confidenceScore: 0.85,
            payload: {
              skill_name: stringOrEmpty(input.skill),
              args: input.args,
              triggered_by_tool: toolId,
            },
          }),
        );
        break;
      }

      // 다른 도구는 tool.started만으로 충분
    }
  }

  // ── 이벤트 팩토리 ──────────────────────────────────────────

  private makeEvent(
    eventKind: EventKind,
    entityType: EntityType,
    entityId: string,
    opts: {
      sessionId: string;
      occurredAt: string;
      parentId?: string;
      accuracy?: TokenAccuracy;
      confidenceScore?: number;
      payload: Record<string, unknown>;
    },
  ): EventEntity {
    return {
      eventId: randomUUID(),
      eventKind,
      sessionId: opts.sessionId,
      occurredAt: opts.occurredAt,
      entityType,
      entityId,
      parentId: opts.parentId,
      accuracy: opts.accuracy,
      confidenceScore: opts.confidenceScore,
      payload: opts.payload,
    };
  }
}

// ── helpers ──────────────────────────────────────────────────

function truncate(s: string, max = PREVIEW_MAX_LEN): string {
  return s.length <= max ? s : s.slice(0, max) + '\u2026';
}

function stringOrEmpty(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/** tool_result.content를 문자열로 변환한다. string이면 그대로, 배열이면 text 블록을 결합한다. */
function extractContentText(content: string | readonly RawContentBlock[] | undefined): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return (content as readonly RawContentBlock[])
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text!)
    .join('\n');
}
