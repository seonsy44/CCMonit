export interface SessionViewModel {
  readonly id: string;
  readonly status: string;
  readonly elapsedText: string;
  readonly tokenText: string;
}

export class SessionPresenter {
  toViewModel(input: unknown): SessionViewModel {
    void input;
    throw new Error('Not implemented');
  }
}
