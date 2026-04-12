import type { EventEntity } from '@ccmonit/domain/entities/event.js';

export interface EventSourcePort {
  start(): Promise<void>;
  stop(): Promise<void>;
  /** 파싱 완료된 이벤트를 수신한다. 리스너는 비동기여도 된다. */
  onEvent(listener: (event: EventEntity) => void | Promise<void>): void;
  onError(listener: (error: Error) => void): void;
}
