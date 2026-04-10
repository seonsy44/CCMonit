import { Command } from 'commander';
import { createApp } from './bootstrap/create-app.js';
import { registerSignals } from './bootstrap/register-signals.js';
import { registerMonitorCommand } from './commands/monitor.command.js';
import { registerReportCommand } from './commands/report.command.js';
import { registerReplayCommand } from './commands/replay.command.js';
import { registerDoctorCommand } from './commands/doctor.command.js';

export async function main(): Promise<void> {
  const program = new Command();
  program.name('ccmonit').description('Claude Code monitor scaffold');

  const app = await createApp();
  registerSignals(app);
  registerMonitorCommand(program, app);
  registerReportCommand(program, app);
  registerReplayCommand(program, app);
  registerDoctorCommand(program, app);

  await program.parseAsync(process.argv);
}

void main();
