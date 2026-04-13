import { homedir } from 'node:os';
import { join } from 'node:path';
import type { CcmonitConfig } from '@ccmonit/shared/config/config.types.js';
import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { ClockPort } from '@ccmonit/application/ports/clock.port.js';
import type { ReportDto } from '@ccmonit/application/dto/report.dto.js';
import { IngestEventUsecase } from '@ccmonit/application/usecases/ingest-event.usecase.js';
import { StartMonitoringUsecase } from '@ccmonit/application/usecases/start-monitoring.usecase.js';
import { StopMonitoringUsecase } from '@ccmonit/application/usecases/stop-monitoring.usecase.js';
import { BuildSessionSummaryUsecase } from '@ccmonit/application/usecases/build-session-summary.usecase.js';
import { DetectAlertsUsecase } from '@ccmonit/application/usecases/detect-alerts.usecase.js';
import { GenerateReportUsecase } from '@ccmonit/application/usecases/generate-report.usecase.js';
import { TokenAggregationService } from '@ccmonit/domain/services/token-aggregation.service.js';
import { CostEstimationService } from '@ccmonit/domain/services/cost-estimation.service.js';
import { SessionHealthService } from '@ccmonit/domain/services/session-health.service.js';
import { StuckDetectionService } from '@ccmonit/domain/services/stuck-detection.service.js';
import { MemoryEventStore } from '@ccmonit/infra/storage/memory/memory-event-store.js';
import { MemorySessionStore } from '@ccmonit/infra/storage/memory/memory-session-store.js';
import { ClaudeLogWatcher } from '@ccmonit/infra/adapters/claude-code/claude-log-watcher.js';
import { JsonReportWriter } from '@ccmonit/infra/adapters/reports/json-report-writer.js';
import { MarkdownReportWriter } from '@ccmonit/infra/adapters/reports/markdown-report-writer.js';
import { CsvReportWriter } from '@ccmonit/infra/adapters/reports/csv-report-writer.js';
import { SessionPresenter } from '../presenters/session.presenter.js';
import { loadConfig } from './load-config.js';

export type ReportFormat = 'json' | 'markdown' | 'csv';

export interface GenerateReportOptions {
  readonly sessionId: string;
  readonly format: ReportFormat;
  readonly outputDir: string;
}

export interface CliApp {
  readonly name: 'ccmonit';
  readonly config: CcmonitConfig;
  readonly sessionStore: SessionStorePort;
  readonly buildSummary: BuildSessionSummaryUsecase;
  readonly detectAlerts: DetectAlertsUsecase;
  readonly presenter: SessionPresenter;
  start(): Promise<void>;
  stop(): Promise<void>;
  generateReport(options: GenerateReportOptions): Promise<ReportDto | null>;
}

export async function createApp(): Promise<CliApp> {
  const config = await loadConfig();

  // ── Clock ───────────────────────────────────────────
  const clock: ClockPort = { now: () => new Date() };

  // ── Storage ─────────────────────────────────────────
  const eventStore = new MemoryEventStore();
  const sessionStore = new MemorySessionStore();

  // ── Domain services ─────────────────────────────────
  const tokenAggregation = new TokenAggregationService();
  const costEstimation = new CostEstimationService();
  const sessionHealth = new SessionHealthService();
  const stuckDetection = new StuckDetectionService();

  // ── Application usecases ────────────────────────────
  const ingestEvent = new IngestEventUsecase(eventStore, sessionStore, clock);
  const buildSummary = new BuildSessionSummaryUsecase(
    eventStore,
    sessionStore,
    clock,
    tokenAggregation,
    costEstimation,
    sessionHealth,
  );
  const detectAlerts = new DetectAlertsUsecase(
    eventStore,
    sessionStore,
    clock,
    stuckDetection,
    sessionHealth,
  );

  // ── Event source ────────────────────────────────────
  const logDir = resolveLogDir();
  const eventSource = new ClaudeLogWatcher({ logDir, fromStart: true });
  const startMonitoring = new StartMonitoringUsecase(eventSource, ingestEvent);
  const stopMonitoring = new StopMonitoringUsecase(eventSource);

  // ── Presenter ───────────────────────────────────────
  const presenter = new SessionPresenter();

  return {
    name: 'ccmonit',
    config,
    sessionStore,
    buildSummary,
    detectAlerts,
    presenter,
    async start() {
      eventSource.onError((err) => {
        // 어댑터 오류는 로깅만 하고 앱을 중단하지 않는다
        process.stderr.write(`[ccmonit] adapter error: ${err.message}\n`);
      });
      await startMonitoring.execute();
    },
    async stop() {
      await stopMonitoring.execute();
    },
    async generateReport({ sessionId, format, outputDir }) {
      const writer =
        format === 'json'
          ? new JsonReportWriter(outputDir)
          : format === 'csv'
            ? new CsvReportWriter(outputDir)
            : new MarkdownReportWriter(outputDir);
      const uc = new GenerateReportUsecase(buildSummary, detectAlerts, writer, clock);
      return uc.execute({ sessionId });
    },
  };
}

/**
 * Claude Code 프로젝트 로그 디렉터리를 추정한다.
 * 경로: ~/.claude/projects/{encoded-cwd}
 * 인코딩: 절대경로의 '/'를 '-'로 치환
 */
function resolveLogDir(): string {
  const cwd = process.cwd();
  const encoded = cwd.replace(/\//g, '-');
  return join(homedir(), '.claude', 'projects', encoded);
}
