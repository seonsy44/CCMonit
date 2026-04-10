export interface TokenBreakdownViewModel {
  readonly totalText: string;
  readonly inputText: string;
  readonly outputText: string;
  readonly accuracy: string;
}

export class TokenPresenter {
  toViewModel(input: unknown): TokenBreakdownViewModel {
    void input;
    throw new Error('Not implemented');
  }
}
