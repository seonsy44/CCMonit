import { render, type Instance } from 'ink';
import { createElement } from 'react';
import { App } from './components/app.js';

export interface AppScreenDependencies {
  readonly presenters?: unknown;
  readonly theme?: unknown;
}

export class AppScreen {
  private instance: Instance | null = null;

  constructor(private readonly deps: AppScreenDependencies) {
    void this.deps;
  }

  mount(): void {
    this.instance = render(createElement(App));
  }

  unmount(): void {
    this.instance?.unmount();
    this.instance = null;
  }

  async waitUntilExit(): Promise<void> {
    await this.instance?.waitUntilExit();
  }
}
