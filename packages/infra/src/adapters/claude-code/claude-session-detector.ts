import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { TokenAccuracy } from '@ccmonit/domain/value-objects/token-accuracy.js';
import type { RawClaudeLine } from './types.js';

/** 세션 감지 결과. 최초 등장 시에만 반환된다. */
export interface DetectedSession {
  readonly sessionId: SessionId;
  readonly cwd: string;
  readonly model?: string;
  readonly provider?: string;
  readonly version?: string;
  readonly startedAt: string;
  readonly startedAtAccuracy: TokenAccuracy;
}

/**
 * Claude Code 로그에서 세션 경계를 감지한다.
 *
 * - 새로운 sessionId가 처음 등장하면 DetectedSession을 반환한다.
 * - 이미 알려진 세션은 null을 반환한다.
 * - timestamp가 없는 라인의 경우 현재 시각을 대체 사용하며 accuracy를 낮춘다.
 */
export class ClaudeSessionDetector {
  private readonly known = new Map<string, DetectedSession>();

  detect(line: RawClaudeLine): DetectedSession | null {
    const sid = line.sessionId;
    if (!sid || this.known.has(sid)) return null;

    const hasTimestamp = typeof line.timestamp === 'string';
    const session: DetectedSession = {
      sessionId: sid,
      cwd: line.cwd ?? process.cwd(),
      model: line.message?.model,
      version: line.version,
      startedAt: hasTimestamp ? line.timestamp! : new Date().toISOString(),
      startedAtAccuracy: hasTimestamp ? 'exact' : 'estimated',
    };

    this.known.set(sid, session);
    return session;
  }

  /** 이미 감지된 세션인지 확인 */
  isKnown(sessionId: string): boolean {
    return this.known.has(sessionId);
  }

  /** 감지된 세션 정보 조회 */
  get(sessionId: string): DetectedSession | undefined {
    return this.known.get(sessionId);
  }

  /** 감지된 전체 세션 수 */
  get size(): number {
    return this.known.size;
  }

  /** 상태 초기화 */
  reset(): void {
    this.known.clear();
  }
}
