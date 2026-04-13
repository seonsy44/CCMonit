import React from 'react';
import { Box, Text } from 'ink';
import type { HeaderViewModel } from '../../presenters/header.presenter.js';
import type { TokenBreakdownViewModel } from '../../presenters/token.presenter.js';
import type { AlertViewModel } from '../../presenters/alert.presenter.js';
import type { TaskViewModel } from '../../presenters/task.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface ReportPreviewViewProps {
  readonly header: HeaderViewModel | null;
  readonly tokenBreakdown: TokenBreakdownViewModel | null;
  readonly alerts: readonly AlertViewModel[];
  readonly tasks: readonly TaskViewModel[];
}

export function ReportPreviewView({
  header,
  tokenBreakdown,
  alerts,
  tasks,
}: ReportPreviewViewProps): React.ReactElement {
  if (!header) {
    return (
      <Box flexDirection="column">
        <Text bold>Report Preview</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>No session data available</Text>
        </Box>
      </Box>
    );
  }

  const failedCount = tasks.filter((t) => t.status === 'failed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <Box flexDirection="column">
      <Text bold>Report Preview</Text>

      {/* Report header */}
      <Box marginTop={1} flexDirection="column">
        <Text color={defaultTheme.border}>{'═'.repeat(50)}</Text>
        <Text bold> Session Report — {header.sessionId}</Text>
        <Text color={defaultTheme.border}>{'═'.repeat(50)}</Text>
      </Box>

      {/* Overview */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color={defaultTheme.border}> Overview</Text>
        <Text> Model:    {header.model}</Text>
        <Text> Status:   {header.status}</Text>
        <Text> Elapsed:  {header.elapsedText} (idle: {header.idleText})</Text>
        <Text> CWD:      {header.cwd}</Text>
      </Box>

      {/* Token summary */}
      {tokenBreakdown && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color={defaultTheme.border}> Token Usage</Text>
          <Text> Input:       {tokenBreakdown.inputText}</Text>
          <Text> Output:      {tokenBreakdown.outputText}</Text>
          <Text> Cache Read:  {tokenBreakdown.cacheReadText}</Text>
          <Text> Cache Write: {tokenBreakdown.cacheWriteText}</Text>
          <Text> Total:       {tokenBreakdown.totalText}  ({tokenBreakdown.costText})</Text>
          <Text> Accuracy:    {tokenBreakdown.accuracy}</Text>
        </Box>
      )}

      {/* Task summary */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color={defaultTheme.border}> Tasks</Text>
        <Text> Total: {tasks.length}  Completed: {completedCount}  Failed: {failedCount}</Text>
      </Box>

      {/* Alerts */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color={defaultTheme.border}> Alerts ({alerts.length})</Text>
        {alerts.length === 0 ? (
          <Text color={defaultTheme.success}> No alerts</Text>
        ) : (
          alerts.slice(0, 10).map((a) => (
            <Text key={a.id} color={defaultTheme.warning}>
              {' '}{a.severity.padEnd(5)} {a.title} ({a.timeText})
            </Text>
          ))
        )}
      </Box>

      <Box marginTop={1}>
        <Text color={defaultTheme.border}>{'═'.repeat(50)}</Text>
      </Box>
    </Box>
  );
}
