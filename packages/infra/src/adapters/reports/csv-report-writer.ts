import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ReportWriterPort } from '@ccmonit/application/ports/report-writer.port.js';
import type { ReportDto } from '@ccmonit/application/dto/report.dto.js';

/**
 * CSV 형식으로 토큰 요약을 저장하는 ReportWriter 구현.
 *
 * - `{baseDir}/{sessionId}/token-breakdown.csv` 경로에 기록한다.
 * - 세션 요약 + 알림 목록을 CSV 행으로 출력한다.
 */
export class CsvReportWriter implements ReportWriterPort {
  constructor(private readonly baseDir: string) {}

  async write(report: ReportDto): Promise<void> {
    const filePath = join(this.baseDir, report.summary.sessionId, 'token-breakdown.csv');
    await mkdir(dirname(filePath), { recursive: true });

    const lines: string[] = [];

    // 세션 요약 헤더 + 행
    lines.push(
      'session_id,status,model,started_at,elapsed_sec,idle_sec,input_tokens,output_tokens,cache_read,cache_write,total_tokens,accuracy,health,alert_count',
    );
    const s = report.summary;
    const t = s.tokens;
    lines.push(
      [
        s.sessionId,
        s.status,
        s.model ?? '',
        s.startedAt,
        s.totalElapsedSec,
        s.totalIdleSec,
        t.inputTokens,
        t.outputTokens,
        t.cacheReadTokens,
        t.cacheWriteTokens,
        t.totalTokens,
        t.accuracy,
        s.healthLevel,
        s.alertCount,
      ].join(','),
    );

    // 알림 섹션
    if (report.alerts.length > 0) {
      lines.push('');
      lines.push('alert_id,type,severity,title,raised_at,status');
      for (const a of report.alerts) {
        lines.push(
          [a.alertId, a.alertType, a.severity, csvEscape(a.title), a.raisedAt, a.status].join(','),
        );
      }
    }

    await writeFile(filePath, lines.join('\n') + '\n', 'utf8');
  }
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
