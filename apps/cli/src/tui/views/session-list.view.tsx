import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { SessionViewModel } from '../../presenters/session.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SessionListViewProps {
  readonly sessions: readonly SessionViewModel[];
  readonly selectedSessionId?: string;
  readonly onSelect?: (sessionId: string) => void;
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

export function SessionListView({
  sessions,
  selectedSessionId,
  onSelect,
}: SessionListViewProps): React.ReactElement {
  const [cursorIndex, setCursorIndex] = useState(() => {
    if (selectedSessionId) {
      const idx = sessions.findIndex((s) => s.id === selectedSessionId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  useInput((input, key) => {
    if (sessions.length === 0) return;

    if (key.upArrow) {
      setCursorIndex((prev) => (prev > 0 ? prev - 1 : sessions.length - 1));
    }
    if (key.downArrow) {
      setCursorIndex((prev) => (prev < sessions.length - 1 ? prev + 1 : 0));
    }
    if (key.return && onSelect && sessions[cursorIndex]) {
      onSelect(sessions[cursorIndex]!.id);
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold>Recent Sessions ({sessions.length})</Text>
      <Text color={defaultTheme.muted}>↑↓ navigate | Enter select | Esc back</Text>

      {/* Column headers */}
      <Box marginTop={1} gap={1}>
        <Text color={defaultTheme.muted}>{' '.padEnd(4)}</Text>
        <Text color={defaultTheme.muted}>{'ID'.padEnd(10)}</Text>
        <Text color={defaultTheme.muted}>{'Status'.padEnd(12)}</Text>
        <Text color={defaultTheme.muted}>{'Elapsed'.padStart(8)}</Text>
        <Text color={defaultTheme.muted}>{'Tokens'.padStart(10)}</Text>
        <Text color={defaultTheme.muted}>{'Model'}</Text>
      </Box>

      {sessions.length === 0 ? (
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>No sessions found</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          {sessions.map((s, i) => (
            <SessionRow
              key={s.id}
              session={s}
              isCursor={i === cursorIndex}
              isSelected={s.id === selectedSessionId}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

function SessionRow({
  session,
  isCursor,
  isSelected,
}: {
  session: SessionViewModel;
  isCursor: boolean;
  isSelected: boolean;
}): React.ReactElement {
  const statusColor = STATUS_COLORS[session.status] ?? defaultTheme.muted;
  const icon = STATUS_ICONS[session.status] ?? '?';
  const cursor = isCursor ? '>' : ' ';
  const selectedMark = isSelected ? '*' : ' ';

  return (
    <Box gap={1}>
      <Text color={isCursor ? defaultTheme.border : defaultTheme.muted} bold={isCursor}>
        {cursor}{selectedMark}
      </Text>
      <Text color={isCursor ? defaultTheme.text : defaultTheme.muted} bold={isCursor}>
        {session.id.padEnd(10)}
      </Text>
      <Text color={statusColor} bold={isCursor}>
        {session.status.padEnd(12)}
      </Text>
      <Text color={defaultTheme.muted}>{session.elapsedText.padStart(8)}</Text>
      <Text color={isCursor ? defaultTheme.text : defaultTheme.muted}>
        {(session.tokenText + ' tok').padStart(10)}
      </Text>
      <Text color={isCursor ? defaultTheme.text : defaultTheme.muted}>{session.model}</Text>
    </Box>
  );
}
