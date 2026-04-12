import type { ReportDto } from '../dto/report.dto.js';

export interface ReportWriterPort {
  write(report: ReportDto): Promise<void>;
}
