export type BudgetStatus = 'within' | 'warning' | 'exceeded';

export interface BudgetCheckResult {
  readonly status: BudgetStatus;
  readonly totalTokens: number;
  readonly budgetTokens: number;
  readonly usageRatio: number;
  readonly remainingTokens: number;
}

export interface BudgetPolicyOptions {
  /** 토큰 예산 상한. 기본: 1_000_000 */
  readonly budgetTokens?: number;
  /** 경고 비율 (0~1). 기본: 0.8 (80%) */
  readonly warningRatio?: number;
}

const DEFAULT_BUDGET = 1_000_000;
const DEFAULT_WARNING_RATIO = 0.8;

/**
 * 토큰 예산 정책을 적용한다.
 *
 * - 현재 토큰 사용량과 예산을 비교하여 상태를 반환한다.
 * - within: 정상 범위, warning: 경고 (80%+), exceeded: 초과
 * - 세션 모니터링 중 TUI footer 또는 alert에서 참조한다.
 */
export class BudgetPolicy {
  private readonly budgetTokens: number;
  private readonly warningRatio: number;

  constructor(options?: BudgetPolicyOptions) {
    this.budgetTokens = options?.budgetTokens ?? DEFAULT_BUDGET;
    this.warningRatio = options?.warningRatio ?? DEFAULT_WARNING_RATIO;
  }

  check(totalTokens: number): BudgetCheckResult {
    const usageRatio =
      this.budgetTokens > 0 ? totalTokens / this.budgetTokens : 0;

    let status: BudgetStatus;
    if (totalTokens >= this.budgetTokens) {
      status = 'exceeded';
    } else if (usageRatio >= this.warningRatio) {
      status = 'warning';
    } else {
      status = 'within';
    }

    return {
      status,
      totalTokens,
      budgetTokens: this.budgetTokens,
      usageRatio,
      remainingTokens: Math.max(0, this.budgetTokens - totalTokens),
    };
  }
}
