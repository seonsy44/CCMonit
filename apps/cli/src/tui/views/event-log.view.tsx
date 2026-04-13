import React from 'react';
import { Box, Text } from 'ink';
import type { EventLogViewModel } from '../../presenters/event-log.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface EventLogViewProps {
  readonly events: readonly EventLogViewModel[];
}

const KIND_COLORS: Record<string, string> = {
  'session.started': defaultTheme.success,
  'session.finished': defaultTheme.muted,
  'agent.started': defaultTheme.success,
  'agent.updated': defaultTheme.text,
  'task.started': defaultTheme.success,
  'task.updated': defaultTheme.text,
  'skill.started': defaultTheme.success,
  'skill.finished': defaultTheme.muted,
  'tool.started': defaultTheme.text,
  'tool.finished': defaultTheme.muted,
  'file.changed': defaultTheme.text,
  'token.updated': defaultTheme.muted,
  'alert.detected': defaultTheme.warning,
  'adapter.health.updated': defaultTheme.muted,
};

export function EventLogView({ events }: EventLogViewProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Text bold>Event Log ({events.length})</Text>

      {/* Column headers */}
      <Box marginTop={1} gap={1}>
        <Text color={defaultTheme.muted}>{'Time'.padEnd(10)}</Text>
        <Text color={defaultTheme.muted}>{'Kind'.padEnd(24)}</Text>
        <Text color={defaultTheme.muted}>{'Entity'.padEnd(10)}</Text>
        <Text color={defaultTheme.muted}>{'ID'}</Text>
      </Box>

      {events.length === 0 ? (
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>No events recorded</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          {events.map((e) => (
            <EventRow key={e.eventId} event={e} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function EventRow({ event }: { event: EventLogViewModel }): React.ReactElement {
  const kindColor = KIND_COLORS[event.eventKind] ?? defaultTheme.text;

  return (
    <Box gap={1}>
      <Text color={defaultTheme.muted}>{event.timeText.padEnd(10)}</Text>
      <Text color={kindColor}>{event.eventKind.padEnd(24)}</Text>
      <Text color={defaultTheme.muted}>{event.entityType.padEnd(10)}</Text>
      <Text color={defaultTheme.text}>{event.entityId}</Text>
    </Box>
  );
}
