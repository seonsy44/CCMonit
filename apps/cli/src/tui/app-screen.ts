export interface AppScreenDependencies {
  readonly presenters?: unknown;
  readonly theme?: unknown;
}

export class AppScreen {
  constructor(private readonly deps: AppScreenDependencies) {}

  mount(): void {
    void this.deps;
    throw new Error('Not implemented');
  }

  unmount(): void {
    throw new Error('Not implemented');
  }
}
