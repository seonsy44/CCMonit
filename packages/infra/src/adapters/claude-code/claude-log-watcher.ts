import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import type { EventSourcePort } from '@ccmonit/application/ports/event-source.port.js';
import type { EventEntity } from '@ccmonit/domain/entities/event.js';
import { fileTail } from '../../utils/file-tail.js';
import { ClaudeEventParser } from './claude-event-parser.js';

export interface ClaudeLogWatcherOptions {
  /** Claude Code 프로젝트 로그 디렉터리 (e.g. ~/.claude/projects/{path}) */
  readonly logDir: string;
  /** JSONL 파일 glob 패턴. 기본: ** /subagents/agent-*.jsonl */
  readonly globPattern?: string;
  /** 파일 폴링 주기 (ms). 기본: 250 */
  readonly pollIntervalMs?: number;
  /** 기존 내용부터 읽을지 여부. 기본: false (끝부터) */
  readonly fromStart?: boolean;
}

type EventListener = (event: EventEntity) => void | Promise<void>;
type ErrorListener = (error: Error) => void;

/**
 * Claude Code JSONL 로그 파일을 감시하여 EventSourcePort를 구현한다.
 *
 * - logDir 내 JSONL 파일을 glob으로 탐색한다.
 * - 각 파일을 file-tail로 감시하며 새 줄이 추가되면 파싱한다.
 * - 파싱된 EventEntity를 등록된 리스너에게 전달한다.
 * - 파싱/감시 오류는 에러 리스너로 전달하며 프로세스를 중단하지 않는다.
 */
export class ClaudeLogWatcher implements EventSourcePort {
  private readonly parser = new ClaudeEventParser();
  private readonly eventListeners: EventListener[] = [];
  private readonly errorListeners: ErrorListener[] = [];
  private readonly abortController = new AbortController();
  private readonly activeWatchers: Promise<void>[] = [];
  private readonly watchedFiles = new Set<string>();

  private readonly logDir: string;
  private readonly globPattern: string;
  private readonly pollIntervalMs: number;
  private readonly fromStart: boolean;
  private scanIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(options: ClaudeLogWatcherOptions) {
    this.logDir = options.logDir;
    this.globPattern = options.globPattern ?? '**/subagents/agent-*.jsonl';
    this.pollIntervalMs = options.pollIntervalMs ?? 250;
    this.fromStart = options.fromStart ?? false;
  }

  async start(): Promise<void> {
    // 최초 스캔
    await this.scanForNewFiles();

    // 주기적으로 새 파일 탐색 (새 세션/에이전트 시작 시)
    this.scanIntervalId = setInterval(() => {
      this.scanForNewFiles().catch((err) =>
        this.emitError(err instanceof Error ? err : new Error(String(err))),
      );
    }, 5_000);
  }

  async stop(): Promise<void> {
    if (this.scanIntervalId) {
      clearInterval(this.scanIntervalId);
      this.scanIntervalId = null;
    }
    this.abortController.abort();
    await Promise.allSettled(this.activeWatchers);
  }

  onEvent(listener: EventListener): void {
    this.eventListeners.push(listener);
  }

  onError(listener: ErrorListener): void {
    this.errorListeners.push(listener);
  }

  // ── internals ──────────────────────────────────────────

  private async scanForNewFiles(): Promise<void> {
    const pattern = join(this.logDir, this.globPattern);
    for await (const filePath of glob(pattern)) {
      if (this.watchedFiles.has(filePath)) continue;
      this.watchedFiles.add(filePath);
      const watcher = this.watchFile(filePath);
      this.activeWatchers.push(watcher);
    }
  }

  private async watchFile(filePath: string): Promise<void> {
    try {
      const tail = fileTail(filePath, {
        fromStart: this.fromStart,
        pollIntervalMs: this.pollIntervalMs,
        signal: this.abortController.signal,
      });

      for await (const line of tail) {
        try {
          const events = this.parser.parseLine(line);
          for (const event of events) {
            await this.emitEvent(event);
          }
        } catch (err) {
          this.emitError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    } catch (err) {
      // AbortError는 정상 종료
      if (this.abortController.signal.aborted) return;
      this.emitError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private async emitEvent(event: EventEntity): Promise<void> {
    for (const listener of this.eventListeners) {
      try {
        await listener(event);
      } catch (err) {
        this.emitError(err instanceof Error ? err : new Error(String(err)));
      }
    }
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
