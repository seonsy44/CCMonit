import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { Command } from 'commander';
import type { CliApp } from '../bootstrap/create-app.js';

export function registerDoctorCommand(program: Command, app: CliApp): void {
  program
    .command('doctor')
    .description('Check configuration and environment health')
    .action(() => {
      runDoctor(app);
    });
}

function runDoctor(app: CliApp): void {
  const lines: string[] = [];
  let hasWarn = false;

  lines.push('ccmonit doctor');
  lines.push('');

  // ── Config ─────────────────────────────────────────
  lines.push('Config');
  lines.push(`  refreshIntervalMs : ${app.config.monitor?.refreshIntervalMs ?? '(default)'}`);
  lines.push(`  stuckThresholdMs  : ${app.config.monitor?.stuckThresholdMs ?? '(default)'}`);
  lines.push(`  storage.useSqlite : ${app.config.storage?.useSqlite ?? false}`);
  lines.push('');

  // ── Log directory ──────────────────────────────────
  const logDir = resolveLogDir();
  lines.push('Log directory');
  lines.push(`  path : ${logDir}`);

  if (!existsSync(logDir)) {
    lines.push('  status : WARN — directory not found');
    hasWarn = true;
  } else {
    const ndjsonFiles = readdirSync(logDir).filter((f) => f.endsWith('.jsonl') || f.endsWith('.ndjson'));
    lines.push(`  status : OK`);
    lines.push(`  log files found : ${ndjsonFiles.length}`);
  }
  lines.push('');

  // ── Environment ────────────────────────────────────
  lines.push('Environment');
  lines.push(`  node : ${process.version}`);
  lines.push(`  cwd  : ${process.cwd()}`);
  lines.push('');

  // ── Summary ────────────────────────────────────────
  lines.push(hasWarn ? 'Result: WARN' : 'Result: OK');

  process.stdout.write(lines.join('\n') + '\n');
  if (hasWarn) process.exitCode = 1;
}

function resolveLogDir(): string {
  const cwd = process.cwd();
  const encoded = cwd.replace(/\//g, '-');
  return join(homedir(), '.claude', 'projects', encoded);
}
