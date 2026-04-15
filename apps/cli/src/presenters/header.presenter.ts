import type { SessionSummaryDto } from '@ccmonit/application/dto/session-summary.dto.js';
import { formatDuration } from '@ccmonit/shared/utils/format-duration.js';
import { formatTokens } from '@ccmonit/shared/utils/format-tokens.js';

export interface HeaderViewModel {
  readonly sessionId: string;
  readonly model: string;
  readonly cwd: string;
  readonly elapsedText: string;
  readonly idleText: string;
  readonly inputText: string;
  readonly outputText: string;
  readonly totalText: string;
  readonly status: string;
}

export class HeaderPresenter {
  toViewModel(summary: SessionSummaryDto): HeaderViewModel {
    return {
      sessionId: summary.sessionId.length > 8 ? summary.sessionId.slice(0, 8) : summary.sessionId,
      model: summary.model ?? 'unknown',
      cwd: truncateCwd(summary.cwd),
      elapsedText: formatDuration(summary.totalElapsedSec * 1000),
      idleText: formatDuration(summary.totalIdleSec * 1000),
      inputText: formatTokens(summary.tokens.inputTokens),
      outputText: formatTokens(summary.tokens.outputTokens),
      totalText: formatTokens(summary.tokens.totalTokens),
      status: summary.status,
    };
  }
}

function truncateCwd(cwd: string, maxLen = 40): string {
  if (cwd.length <= maxLen) return cwd;
  return `…${cwd.slice(-(maxLen - 1))}`;
}
