import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { TokenSource } from '@ccmonit/domain/value-objects/token-source.js';
import type { RawClaudeMessage } from './types.js';

/** 추출된 토큰 사용량 */
export interface ExtractedTokenUsage {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
  readonly cacheReadTokens?: number;
  readonly cacheWriteTokens?: number;
  readonly totalTokens: number;
  readonly accuracy: TokenAccuracy;
  readonly source: TokenSource;
}

/**
 * Claude Code assistant 메시지에서 토큰 사용량을 추출한다.
 *
 * - message.usage 필드가 있는 assistant 메시지에서만 추출 가능하다.
 * - API 런타임이 직접 보고하는 값이므로 accuracy='exact', source='runtime'.
 * - usage 필드가 없으면 null을 반환하며, 이벤트를 버리지는 않는다.
 */
export class ClaudeTokenExtractor {
  extract(message: RawClaudeMessage | undefined): ExtractedTokenUsage | null {
    const usage = message?.usage;
    if (!usage) return null;

    const input = usage.input_tokens;
    const output = usage.output_tokens;
    const cacheRead = usage.cache_read_input_tokens;
    const cacheWrite = usage.cache_creation_input_tokens;

    // 유효한 숫자가 하나도 없으면 추출 결과 없음
    if (input == null && output == null) return null;

    return {
      inputTokens: input ?? undefined,
      outputTokens: output ?? undefined,
      cacheReadTokens: cacheRead ?? undefined,
      cacheWriteTokens: cacheWrite ?? undefined,
      totalTokens: (input ?? 0) + (output ?? 0),
      accuracy: 'exact',
      source: 'runtime',
    };
  }
}
