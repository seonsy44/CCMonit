import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';

export function registerMonitorCommand(program: Command, app: CliApp): void {
  program
    .command('monitor')
    .description('monitor command placeholder')
    .action(async () => {
      void app;
      throw new Error('Not implemented');
    });
}
