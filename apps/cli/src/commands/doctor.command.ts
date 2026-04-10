import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';

export function registerDoctorCommand(program: Command, app: CliApp): void {
  program
    .command('doctor')
    .description('doctor command placeholder')
    .action(async () => {
      void app;
      throw new Error('Not implemented');
    });
}
