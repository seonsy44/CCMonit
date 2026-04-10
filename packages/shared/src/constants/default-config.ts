export const defaultConfig = {
  monitor: {
    refreshIntervalMs: 1000,
    stuckThresholdMs: 60_000,
  },
  storage: {
    useSqlite: false,
    eventDir: './data/events',
  },
} as const;
