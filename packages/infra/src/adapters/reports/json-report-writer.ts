import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ReportWriterPort } from '@ccmonit/application/ports/report-writer.port.js';
import type { ReportDto } from '@ccmonit/application/dto/report.dto.js';

/**
 * JSON 형식으로 리포트를 저장하는 ReportWriter 구현.
 *
 * - `{baseDir}/{sessionId}/report.json` 경로에 기록한다.
 * - 저장 모델 doc 권장: `data/reports/{sessionId}/report.json`
 */
export class JsonReportWriter implements ReportWriterPort {
  constructor(private readonly baseDir: string) {}

  async write(report: ReportDto): Promise<void> {
    const filePath = join(
      this.baseDir,
      report.summary.sessionId,
      'report.json',
    );
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
  }
}
