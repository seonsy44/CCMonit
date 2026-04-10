import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';

export function registerReplayCommand(program: Command, app: CliApp): void {
  program
    .command('replay')
    .description('replay command placeholder')
    .action(async () => {
      void app;
      throw new Error('Not implemented');
    });
}
