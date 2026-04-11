import type { TokenAccuracy } from './token-accuracy.js';

/**
 * 경과 시간을 나타내는 값 객체.
 * seconds는 0 이상의 정수여야 한다 (런타임 강제는 projector 책임).
 */
export interface Duration {
  readonly seconds: number;
  readonly accuracy: TokenAccuracy;
}
