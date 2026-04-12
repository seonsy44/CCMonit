import { loadConfig } from './load-config.js';

export interface CliApp {
  readonly name: 'ccmonit';
  readonly config: unknown;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export async function createApp(): Promise<CliApp> {
  const config = await loadConfig();

  return {
    name: 'ccmonit',
    config,
    async start() {},
    async stop() {},
  };
}
