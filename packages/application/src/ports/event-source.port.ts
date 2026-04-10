export interface EventSourcePort {
  start(): Promise<void>;
  stop(): Promise<void>;
  onEvent(listener: (event: unknown) => void): void;
  onError(listener: (error: Error) => void): void;
}
