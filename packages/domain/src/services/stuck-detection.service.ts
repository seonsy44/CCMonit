// ── Types ──────────────────────────────────────────────

export interface StuckDetectionInput {
  readonly nowMs: number;
  readonly lastMeaningfulEventMs?: number;
  readonly stuckThresholdMs: number;
  readonly hasRecentToolCall: boolean;
  readonly hasRecentFileChange: boolean;
  readonly recentErrorCount: number;
  readonly isLongRunningExpected: boolean;
}

export interface StuckEvidence {
  readonly silenceExceedsThreshold: boolean;
  readonly noRecentToolCalls: boolean;
  readonly noRecentFileChanges: boolean;
  readonly errorRepetition: boolean;
}

export interface StuckDetectionResult {
  readonly isStuck: boolean;
  readonly silenceDurationMs: number;
  readonly evidence: StuckEvidence;
}

// ── Constants ──────────────────────────────────────────

const ERROR_REPETITION_THRESHOLD = 3;

// ── Service ────────────────────────────────────────────

export class StuckDetectionService {
  detect(input: StuckDetectionInput): StuckDetectionResult {
    const silenceDurationMs =
      input.lastMeaningfulEventMs != null
        ? Math.max(0, input.nowMs - input.lastMeaningfulEventMs)
        : 0;

    const silenceExceedsThreshold =
      silenceDurationMs >= input.stuckThresholdMs;
    const noRecentToolCalls = !input.hasRecentToolCall;
    const noRecentFileChanges = !input.hasRecentFileChange;
    const errorRepetition =
      input.recentErrorCount >= ERROR_REPETITION_THRESHOLD;

    const evidence: StuckEvidence = {
      silenceExceedsThreshold,
      noRecentToolCalls,
      noRecentFileChanges,
      errorRepetition,
    };

    let isStuck: boolean;

    if (!silenceExceedsThreshold) {
      isStuck = false;
    } else if (input.isLongRunningExpected) {
      // Long-running tasks need stronger corroboration
      isStuck =
        (noRecentToolCalls && noRecentFileChanges) || errorRepetition;
    } else {
      // Normal tasks: silence + any one corroborating signal
      isStuck = noRecentToolCalls || noRecentFileChanges || errorRepetition;
    }

    return { isStuck, silenceDurationMs, evidence };
  }
}
