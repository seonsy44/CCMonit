import { rename, stat, unlink } from 'node:fs/promises';

export interface RotatingLogPolicyOptions {
  /** 로테이션 기준 파일 크기 (bytes). 기본값: 10 MB */
  readonly maxSizeBytes?: number;
  /** 보관할 아카이브 파일 수. 기본값: 5 */
  readonly maxFiles?: number;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const DEFAULT_MAX_FILES = 5;

/**
 * 파일 크기 기반 로그 로테이션 정책.
 *
 * - 파일이 maxSizeBytes를 초과하면 로테이션 대상으로 판정한다.
 * - 로테이션 시 기존 파일을 `.1`, `.2`, ... `.N`으로 순차 이동한다.
 * - maxFiles 초과 아카이브는 삭제한다.
 *
 * 사용 예:
 * ```ts
 * const policy = new RotatingLogPolicy({ maxSizeBytes: 5_000_000 });
 * if (await policy.shouldRotate(logPath)) {
 *   await policy.rotate(logPath);
 * }
 * ```
 */
export class RotatingLogPolicy {
  private readonly maxSizeBytes: number;
  private readonly maxFiles: number;

  constructor(options?: RotatingLogPolicyOptions) {
    this.maxSizeBytes = options?.maxSizeBytes ?? DEFAULT_MAX_SIZE;
    this.maxFiles = options?.maxFiles ?? DEFAULT_MAX_FILES;
  }

  /** 파일이 로테이션 기준을 초과했는지 확인 */
  async shouldRotate(filePath: string): Promise<boolean> {
    try {
      const s = await stat(filePath);
      return s.size >= this.maxSizeBytes;
    } catch {
      return false;
    }
  }

  /**
   * 파일을 로테이션한다.
   *
   * `log.ndjson` → `log.ndjson.1` → `log.ndjson.2` → ... → 삭제
   */
  async rotate(filePath: string): Promise<void> {
    // 가장 오래된 아카이브부터 밀어내기
    const oldest = `${filePath}.${this.maxFiles}`;
    await tryUnlink(oldest);

    // 역순으로 이름 변경: .4 → .5, .3 → .4, ... .1 → .2
    for (let i = this.maxFiles - 1; i >= 1; i--) {
      const from = `${filePath}.${i}`;
      const to = `${filePath}.${i + 1}`;
      await tryRename(from, to);
    }

    // 현재 파일 → .1
    await tryRename(filePath, `${filePath}.1`);
  }
}

// ── helpers ──────────────────────────────────────────────────

async function tryRename(from: string, to: string): Promise<void> {
  try {
    await rename(from, to);
  } catch {
    // 파일이 없으면 무시
  }
}

async function tryUnlink(path: string): Promise<void> {
  try {
    await unlink(path);
  } catch {
    // 파일이 없으면 무시
  }
}
