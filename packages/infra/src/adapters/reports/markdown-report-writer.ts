import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ReportWriterPort } from '@ccmonit/application/ports/report-writer.port.js';
import type { ReportDto } from '@ccmonit/application/dto/report.dto.js';

/**
 * Markdown 형식으로 세션 리포트를 저장하는 ReportWriter 구현.
 *
 * - `{baseDir}/{sessionId}/report.md` 경로에 기록한다.
 * - 세션 요약, 토큰 내역, 알림 목록을 섹션별로 구성한다.
 */
export class MarkdownReportWriter implements ReportWriterPort {
  constructor(private readonly baseDir: string) {}

  async write(report: ReportDto): Promise<void> {
    const filePath = join(this.baseDir, report.summary.sessionId, 'report.md');
    await mkdir(dirname(filePath), { recursive: true });

    const md = buildMarkdown(report);
    await writeFile(filePath, md, 'utf8');
  }
}

// ── markdown builder ────────────────────────────────────

function buildMarkdown(report: ReportDto): string {
  const s = report.summary;
  const t = s.tokens;
  const lines: string[] = [];

  // 제목
  lines.push(`# Session Report: ${s.sessionId}`);
  lines.push('');
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push('');

  // 세션 요약
  lines.push('## Session Summary');
  lines.push('');
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Status | ${s.status} |`);
  lines.push(`| Health | ${s.healthLevel} |`);
  lines.push(`| Model | ${s.model ?? 'unknown'} |`);
  lines.push(`| CWD | ${s.cwd} |`);
  lines.push(`| Started | ${s.startedAt} |`);
  if (s.endedAt) lines.push(`| Ended | ${s.endedAt} |`);
  lines.push(`| Elapsed | ${formatDuration(s.totalElapsedSec)} |`);
  lines.push(`| Idle | ${formatDuration(s.totalIdleSec)} |`);
  lines.push(`| Agents | ${s.activeAgentCount} |`);
  lines.push(`| Tasks | ${s.activeTaskCount} |`);
  lines.push(`| Alerts | ${s.alertCount} |`);
  lines.push('');

  // 토큰 내역
  lines.push('## Token Breakdown');
  lines.push('');
  lines.push(`| Category | Tokens |`);
  lines.push(`|----------|--------|`);
  lines.push(`| Input | ${fmt(t.inputTokens)} |`);
  lines.push(`| Output | ${fmt(t.outputTokens)} |`);
  lines.push(`| Cache Read | ${fmt(t.cacheReadTokens)} |`);
  lines.push(`| Cache Write | ${fmt(t.cacheWriteTokens)} |`);
  lines.push(`| **Total** | **${fmt(t.totalTokens)}** |`);
  lines.push(`| Accuracy | ${t.accuracy} |`);
  lines.push('');

  if (s.cost) {
    lines.push('## Cost Estimate');
    lines.push('');
    lines.push(`| Category | USD |`);
    lines.push(`|----------|-----|`);
    lines.push(`| Input | $${s.cost.breakdown.inputCostUsd.toFixed(4)} |`);
    lines.push(`| Output | $${s.cost.breakdown.outputCostUsd.toFixed(4)} |`);
    lines.push(`| Cache Read | $${s.cost.breakdown.cacheReadCostUsd.toFixed(4)} |`);
    lines.push(`| Cache Write | $${s.cost.breakdown.cacheWriteCostUsd.toFixed(4)} |`);
    lines.push(`| **Total** | **$${s.cost.totalCostUsd.toFixed(4)}** |`);
    lines.push(`| Accuracy | ${s.cost.accuracy} |`);
    lines.push('');
  }

  // 알림
  if (report.alerts.length > 0) {
    lines.push('## Alerts');
    lines.push('');
    lines.push(`| Type | Severity | Title | Raised At | Status |`);
    lines.push(`|------|----------|-------|-----------|--------|`);
    for (const a of report.alerts) {
      lines.push(`| ${a.alertType} | ${a.severity} | ${a.title} | ${a.raisedAt} | ${a.status} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
