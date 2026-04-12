import { render, type Instance } from 'ink';
import { createElement } from 'react';
import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { BuildSessionSummaryUsecase } from '@ccmonit/application/usecases/build-session-summary.usecase.js';
import type { SessionPresenter } from '../presenters/session.presenter.js';
import { App } from './components/app.js';

export interface AppScreenDependencies {
  readonly sessionStore: SessionStorePort;
  readonly buildSummary: BuildSessionSummaryUsecase;
  readonly presenter: SessionPresenter;
  readonly refreshIntervalMs: number;
}

export class AppScreen {
  private instance: Instance | null = null;

  constructor(private readonly deps: AppScreenDependencies) {}

  mount(): void {
    if (!process.stdin.isTTY) {
      process.stderr.write(
        '[ccmonit] TTY not detected — monitor requires an interactive terminal.\n',
      );
      return;
    }

    this.instance = render(
      createElement(App, {
        sessionStore: this.deps.sessionStore,
        buildSummary: this.deps.buildSummary,
        presenter: this.deps.presenter,
        refreshIntervalMs: this.deps.refreshIntervalMs,
      }),
    );
  }

  unmount(): void {
    this.instance?.unmount();
    this.instance = null;
  }

  async waitUntilExit(): Promise<void> {
    await this.instance?.waitUntilExit();
  }
}
