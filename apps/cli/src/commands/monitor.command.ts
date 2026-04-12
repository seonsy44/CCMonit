import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';
import { AppScreen } from '../tui/app-screen.js';

export function registerMonitorCommand(program: Command, app: CliApp): void {
  program
    .command('monitor')
    .description('Real-time session monitor')
    .action(async () => {
      await app.start();
      const screen = new AppScreen({});
      screen.mount();
      await screen.waitUntilExit();
    });
}
