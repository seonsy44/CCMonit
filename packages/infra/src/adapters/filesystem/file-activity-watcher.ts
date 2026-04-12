import { watch } from 'node:fs/promises';
import { relative } from 'node:path';

export type FileChangeKind = 'change' | 'rename';

export interface FileChangeEvent {
  readonly kind: FileChangeKind;
  /** 감시 대상 디렉터리 기준 상대 경로 */
  readonly relativePath: string;
  readonly detectedAt: string;
}

type FileChangeListener = (event: FileChangeEvent) => void;
type ErrorListener = (error: Error) => void;

/**
 * 워크스페이스 내 파일 변경을 감시한다.
 *
 * - Node.js fs.watch (recursive) 기반.
 * - 변경 감지 시 등록된 리스너에게 FileChangeEvent를 전달한다.
 * - node_modules, .git, dist 등 불필요한 경로는 무시한다.
 */
export class FileActivityWatcher {
  private readonly watchDir: string;
  private readonly changeListeners: FileChangeListener[] = [];
  private readonly errorListeners: ErrorListener[] = [];
  private readonly abortController = new AbortController();
  private watcherPromise: Promise<void> | null = null;

  constructor(watchDir: string) {
    this.watchDir = watchDir;
  }

  async start(): Promise<void> {
    this.watcherPromise = this.runWatcher();
  }

  async stop(): Promise<void> {
    this.abortController.abort();
    if (this.watcherPromise) {
      await this.watcherPromise.catch(() => {});
    }
  }

  onChange(listener: FileChangeListener): void {
    this.changeListeners.push(listener);
  }

  onError(listener: ErrorListener): void {
    this.errorListeners.push(listener);
  }

  // ── internals ──────────────────────────────────────────

  private async runWatcher(): Promise<void> {
    try {
      const watcher = watch(this.watchDir, {
        recursive: true,
        signal: this.abortController.signal,
      });

      for await (const event of watcher) {
        const filename = event.filename;
        if (!filename || this.shouldIgnore(filename)) continue;

        const change: FileChangeEvent = {
          kind: event.eventType === 'rename' ? 'rename' : 'change',
          relativePath: relative(this.watchDir, filename),
          detectedAt: new Date().toISOString(),
        };

        for (const listener of this.changeListeners) {
          try {
            listener(change);
          } catch (err) {
            this.emitError(err instanceof Error ? err : new Error(String(err)));
          }
        }
      }
    } catch (err) {
      if (this.abortController.signal.aborted) return;
      this.emitError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private shouldIgnore(filename: string): boolean {
    return IGNORE_PATTERNS.some((p) => filename.includes(p));
  }

  private emitError(error: Error): void {
    for (const listener of this.errorListeners) {
      try {
        listener(error);
      } catch {
        // 에러 리스너 자체 실패는 무시
      }
    }
  }
}

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.cache',
  '.DS_Store',
  '.ndjson',
  '.sqlite',
];
