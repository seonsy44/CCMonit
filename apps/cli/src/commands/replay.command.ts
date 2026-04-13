import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';

export function registerReplayCommand(program: Command, app: CliApp): void {
  program
    .command('replay')
    .description('Replay a past session (available in V1)')
    .argument('[session-id]', 'Session ID to replay')
    .action(() => {
      void app;
      process.stdout.write('replay: not yet available — scheduled for V1\n');
    });
}
