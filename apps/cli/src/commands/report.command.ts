import type { Command } from 'commander';
import type { CliApp, ReportFormat } from '../bootstrap/create-app.js';

const VALID_FORMATS: ReportFormat[] = ['json', 'markdown', 'csv'];

export function registerReportCommand(program: Command, app: CliApp): void {
  program
    .command('report')
    .description('Generate a session report')
    .option('-s, --session <id>', 'Session ID to report on (defaults to latest)')
    .option('-f, --format <format>', 'Output format: json | markdown | csv', 'markdown')
    .option('-o, --output <dir>', 'Output directory', './data/reports')
    .action(async (opts: { session?: string; format: string; output: string }) => {
      const format = opts.format as ReportFormat;
      if (!VALID_FORMATS.includes(format)) {
        process.stderr.write(`Error: invalid format "${opts.format}". Use: json | markdown | csv\n`);
        process.exitCode = 1;
        return;
      }

      await app.start();

      const sessionId = opts.session ?? (await resolveLatestSessionId(app));
      if (!sessionId) {
        process.stderr.write('Error: no session found. Run "ccmonit monitor" first.\n');
        process.exitCode = 1;
        await app.stop();
        return;
      }

      const report = await app.generateReport({ sessionId, format, outputDir: opts.output });
      await app.stop();

      if (!report) {
        process.stderr.write(`Error: session "${sessionId}" not found or has no data.\n`);
        process.exitCode = 1;
        return;
      }

      process.stdout.write(`Report written to: ${opts.output}/${sessionId}/\n`);
    });
}

async function resolveLatestSessionId(app: CliApp): Promise<string | null> {
  const sessions = await app.sessionStore.listRecent(1);
  return sessions[0]?.sessionId ?? null;
}
