import type { SessionSummaryDto } from '@ccmonit/application/dto/session-summary.dto.js';
import { formatDuration } from '@ccmonit/shared/utils/format-duration.js';
import { formatTokens } from '@ccmonit/shared/utils/format-tokens.js';

export interface SessionViewModel {
  readonly id: string;
  readonly status: string;
  readonly elapsedText: string;
  readonly tokenText: string;
  readonly healthLevel: string;
  readonly model: string;
}

export class SessionPresenter {
  toViewModel(summary: SessionSummaryDto): SessionViewModel {
    return {
      id: summary.sessionId,
      status: summary.status,
      elapsedText: formatDuration(summary.totalElapsedSec * 1000),
      tokenText: formatTokens(summary.tokens.totalTokens),
      healthLevel: summary.healthLevel,
      model: summary.model ?? 'unknown',
    };
  }
}
