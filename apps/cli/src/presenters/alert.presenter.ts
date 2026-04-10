export interface AlertViewModel {
  readonly title: string;
  readonly severity: string;
  readonly description: string;
}

export class AlertPresenter {
  toViewModel(input: unknown): AlertViewModel {
    void input;
    throw new Error('Not implemented');
  }
}
