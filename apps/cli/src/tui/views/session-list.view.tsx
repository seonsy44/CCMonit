import React from 'react';
import { Box, Text } from 'ink';
import type { SessionViewModel } from '../../presenters/session.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SessionListViewProps {
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

const STATUS_ICONS: Record<string, string> = {
  active: '●',
  idle: '◐',
  detected: '○',
  completed: '✓',
  interrupted: '⚠',
  failed: '✗',
};

export function SessionListView({ sessions }: SessionListViewProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Text bold>Recent Sessions ({sessions.length})</Text>

      {/* Column headers */}
      <Box marginTop={1} gap={1}>
        <Text color={defaultTheme.muted}>{' '.padEnd(2)}</Text>
        <Text color={defaultTheme.muted}>{'ID'.padEnd(10)}</Text>
        <Text color={defaultTheme.muted}>{'Status'.padEnd(12)}</Text>
        <Text color={defaultTheme.muted}>{'Elapsed'.padStart(8)}</Text>
        <Text color={defaultTheme.muted}>{'Tokens'.padStart(10)}</Text>
        <Text color={defaultTheme.muted}>{'Cost'.padStart(10)}</Text>
        <Text color={defaultTheme.muted}>{'Model'}</Text>
      </Box>

      {sessions.length === 0 ? (
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>No sessions found</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          {sessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function SessionRow({ session }: { session: SessionViewModel }): React.ReactElement {
  const statusColor = STATUS_COLORS[session.status] ?? defaultTheme.muted;
  const icon = STATUS_ICONS[session.status] ?? '?';

  return (
    <Box gap={1}>
      <Text color={statusColor}>{icon.padEnd(2)}</Text>
      <Text color={defaultTheme.text}>{session.id.padEnd(10)}</Text>
      <Text color={statusColor}>{session.status.padEnd(12)}</Text>
      <Text color={defaultTheme.muted}>{session.elapsedText.padStart(8)}</Text>
      <Text color={defaultTheme.text}>{(session.tokenText + ' tok').padStart(10)}</Text>
      <Text color={defaultTheme.muted}>{session.costText.padStart(10)}</Text>
      <Text color={defaultTheme.text}>{session.model}</Text>
    </Box>
  );
}
