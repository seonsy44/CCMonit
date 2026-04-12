/**
 * Raw Claude Code JSONL 로그 라인 구조.
 * Claude Code가 ~/.claude/projects/{path}/{sessionId}/subagents/agent-{id}.jsonl 에 기록하는 포맷.
 * 이 타입은 adapter 내부 전용이며, 상위 계층으로 노출하지 않는다.
 */
export interface RawClaudeLine {
  readonly parentUuid?: string | null;
  readonly isSidechain?: boolean;
  readonly promptId?: string;
  readonly agentId?: string;
  readonly type?: 'user' | 'assistant';
  readonly message?: RawClaudeMessage;
  readonly uuid?: string;
  readonly timestamp?: string;
  readonly userType?: 'external' | 'internal';
  readonly entrypoint?: string;
  readonly cwd?: string;
  readonly sessionId?: string;
  readonly version?: string;
  readonly gitBranch?: string;
  readonly slug?: string;
}

export interface RawClaudeMessage {
  readonly role?: 'user' | 'assistant';
  readonly content?: string | readonly RawContentBlock[];
  readonly model?: string;
  readonly id?: string;
  readonly stop_reason?: string | null;
  readonly stop_sequence?: string | null;
  readonly usage?: RawTokenUsage;
}

export interface RawContentBlock {
  readonly type: string;
  readonly text?: string;
  /** tool_use block의 호출 ID */
  readonly id?: string;
  /** tool_use block의 도구 이름 */
  readonly name?: string;
  /** tool_use block의 입력 인자 */
  readonly input?: Record<string, unknown>;
  /** tool_result block이 참조하는 tool_use ID */
  readonly tool_use_id?: string;
  /** tool_result block의 결과 내용 */
  readonly content?: string | readonly RawContentBlock[];
  readonly is_error?: boolean;
}

export interface RawTokenUsage {
  readonly input_tokens?: number;
  readonly output_tokens?: number;
  readonly cache_creation_input_tokens?: number;
  readonly cache_read_input_tokens?: number;
}
