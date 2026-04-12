import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';
import { AppScreen } from '../tui/app-screen.js';

export function registerMonitorCommand(program: Command, app: CliApp): void {
  program
    .command('monitor')
    .description('Real-time session monitor')
    .action(async () => {
      await app.start();

      const screen = new AppScreen({
        sessionStore: app.sessionStore,
        buildSummary: app.buildSummary,
        detectAlerts: app.detectAlerts,
        presenter: app.presenter,
        refreshIntervalMs: app.config.monitor?.refreshIntervalMs ?? 1000,
      });

      screen.mount();
      await screen.waitUntilExit();
      await app.stop();
    });
}
