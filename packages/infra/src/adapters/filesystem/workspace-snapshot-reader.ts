import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

export interface WorkspaceFileInfo {
  readonly relativePath: string;
  readonly sizeBytes: number;
  readonly modifiedAt: string;
  readonly isDirectory: boolean;
}

export interface WorkspaceSnapshot {
  readonly rootDir: string;
  readonly takenAt: string;
  readonly files: readonly WorkspaceFileInfo[];
  readonly totalFiles: number;
  readonly totalSizeBytes: number;
}

/**
 * 워크스페이스의 현재 파일 상태를 스냅샷으로 읽는다.
 *
 * - 최상위 디렉터리 한 단계만 읽는 shallow 모드 (기본).
 * - node_modules, .git 등은 자동 제외한다.
 * - 세션 시작 시 초기 상태 파악 또는 리포트 보조용으로 사용한다.
 */
export class WorkspaceSnapshotReader {
  private readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async read(): Promise<WorkspaceSnapshot> {
    const entries = await readdir(this.rootDir, { withFileTypes: true });
    const files: WorkspaceFileInfo[] = [];
    let totalSizeBytes = 0;

    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue;

      const fullPath = join(this.rootDir, entry.name);
      try {
        const s = await stat(fullPath);
        const info: WorkspaceFileInfo = {
          relativePath: relative(this.rootDir, fullPath),
          sizeBytes: s.size,
          modifiedAt: s.mtime.toISOString(),
          isDirectory: entry.isDirectory(),
        };
        files.push(info);
        totalSizeBytes += s.size;
      } catch {
        // 심볼릭 링크 깨짐 등 — 건너뜀
      }
    }

    return {
      rootDir: this.rootDir,
      takenAt: new Date().toISOString(),
      files,
      totalFiles: files.length,
      totalSizeBytes,
    };
  }
}

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', '.cache', '.pnpm-store']);
