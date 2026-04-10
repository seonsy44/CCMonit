import type { CliApp } from './create-app.js';

export function registerSignals(app: CliApp): void {
  const stop = async () => {
    try {
      await app.stop();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => void stop());
  process.on('SIGTERM', () => void stop());
}
