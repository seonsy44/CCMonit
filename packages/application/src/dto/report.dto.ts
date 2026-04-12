import type { AlertEntity } from '@ccmonit/domain/entities/alert.js';
import type { SessionSummaryDto } from './session-summary.dto.js';

export interface ReportDto {
  readonly generatedAt: string;
  readonly summary: SessionSummaryDto;
  readonly alerts: readonly AlertEntity[];
}
