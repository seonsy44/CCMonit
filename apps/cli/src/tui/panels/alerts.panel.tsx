import React from 'react';
import { Box, Text } from 'ink';
import type { AlertViewModel } from '../../presenters/alert.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface AlertsPanelProps {
  readonly alerts: readonly AlertViewModel[];
}

const SEVERITY_COLORS: Record<string, string> = {
  error: defaultTheme.danger,
  warn: defaultTheme.warning,
  info: defaultTheme.muted,
};

const SEVERITY_ICONS: Record<string, string> = {
  error: '✗',
  warn: '⚠',
  info: '●',
};

export function AlertsPanel({ alerts }: AlertsPanelProps): React.ReactElement {
  if (alerts.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Alerts</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.success}>No alerts</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Alerts ({alerts.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {alerts.map((a) => (
          <AlertRow key={a.id} alert={a} />
        ))}
      </Box>
    </Box>
  );
}

function AlertRow({ alert }: { alert: AlertViewModel }): React.ReactElement {
  const color = SEVERITY_COLORS[alert.severity] ?? defaultTheme.muted;
  const icon = SEVERITY_ICONS[alert.severity] ?? '?';

  return (
    <Box gap={1}>
      <Text color={color}>{icon}</Text>
      <Text color={color}>{alert.severity.padEnd(5)}</Text>
      <Text color={defaultTheme.text}>{alert.title}</Text>
      <Text color={defaultTheme.muted}>{alert.timeText}</Text>
    </Box>
  );
}
