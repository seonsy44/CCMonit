export interface CcmonitConfig {
  readonly monitor?: {
    readonly refreshIntervalMs?: number;
    readonly stuckThresholdMs?: number;
  };
  readonly storage?: {
    readonly useSqlite?: boolean;
    readonly eventDir?: string;
  };
}
