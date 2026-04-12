import React from 'react';
import { Box, Text } from 'ink';
import type { SessionViewModel } from '../../presenters/session.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SummaryPanelProps {
  readonly sessions: readonly SessionViewModel[];
}

const STATUS_COLORS: Record<string, string> = {
  active: defaultTheme.success,
  idle: defaultTheme.warning,
  detected: defaultTheme.muted,
  completed: defaultTheme.muted,
  interrupted: defaultTheme.warning,
  failed: defaultTheme.danger,
};

const STATUS_INDICATORS: Record<string, string> = {
  active: '●',
  idle: '◐',
  detected: '○',
  completed: '✓',
  interrupted: '⚠',
  failed: '✗',
};

const HEALTH_COLORS: Record<string, string> = {
  healthy: defaultTheme.success,
  degraded: defaultTheme.warning,
  unhealthy: defaultTheme.danger,
  critical: defaultTheme.danger,
};

export function SummaryPanel({ sessions }: SummaryPanelProps): React.ReactElement {
  if (sessions.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Sessions</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>Waiting for sessions...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Sessions</Text>
      <Box marginTop={1} flexDirection="column" gap={0}>
        {sessions.map((s) => (
          <SessionRow key={s.id} session={s} />
        ))}
      </Box>
    </Box>
  );
}

function SessionRow({ session }: { session: SessionViewModel }): React.ReactElement {
  const statusColor = STATUS_COLORS[session.status] ?? defaultTheme.muted;
  const indicator = STATUS_INDICATORS[session.status] ?? '?';
  const healthColor = HEALTH_COLORS[session.healthLevel] ?? defaultTheme.muted;
  const shortId = session.id.length > 8 ? session.id.slice(0, 8) : session.id;

  return (
    <Box gap={1}>
      <Text color={statusColor}>{indicator}</Text>
      <Text color={defaultTheme.text}>{shortId}</Text>
      <Text color={statusColor}>{session.status.padEnd(11)}</Text>
      <Text color={defaultTheme.muted}>{session.elapsedText.padStart(8)}</Text>
      <Text color={defaultTheme.text}>{session.tokenText.padStart(8)} tok</Text>
      <Text color={defaultTheme.muted}>{session.costText.padStart(8)}</Text>
      <Text color={healthColor}>{session.model}</Text>
    </Box>
  );
}
