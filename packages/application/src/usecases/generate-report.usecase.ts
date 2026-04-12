import type { SessionId } from '@ccmonit/domain/value-objects/session-id.js';
import type { ReportWriterPort } from '../ports/report-writer.port.js';
import type { ClockPort } from '../ports/clock.port.js';
import type { ReportDto } from '../dto/report.dto.js';
import type { BuildSessionSummaryUsecase } from './build-session-summary.usecase.js';
import type { DetectAlertsUsecase } from './detect-alerts.usecase.js';

export interface GenerateReportInput {
  readonly sessionId: SessionId;
}

export class GenerateReportUsecase {
  constructor(
    private readonly buildSummary: BuildSessionSummaryUsecase,
    private readonly detectAlerts: DetectAlertsUsecase,
    private readonly reportWriter: ReportWriterPort,
    private readonly clock: ClockPort,
  ) {}

  async execute(input: GenerateReportInput): Promise<ReportDto | null> {
    const summary = await this.buildSummary.execute({ sessionId: input.sessionId });
    if (!summary) return null;

    const { alerts } = await this.detectAlerts.execute({ sessionId: input.sessionId });

    const report: ReportDto = {
      generatedAt: this.clock.now().toISOString(),
      summary,
      alerts,
    };

    await this.reportWriter.write(report);
    return report;
  }
}
