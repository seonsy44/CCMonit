import React from 'react';
import { Box, Text } from 'ink';
import type { TaskViewModel } from '../../presenters/task.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface TaskPanelProps {
  readonly tasks: readonly TaskViewModel[];
}

const STATUS_COLORS: Record<string, string> = {
  queued: defaultTheme.muted,
  running: defaultTheme.success,
  waiting: defaultTheme.warning,
  blocked: defaultTheme.danger,
  retrying: defaultTheme.warning,
  completed: defaultTheme.muted,
  failed: defaultTheme.danger,
  cancelled: defaultTheme.muted,
};

const STATUS_ICONS: Record<string, string> = {
  queued: '○',
  running: '●',
  waiting: '◐',
  blocked: '⊘',
  retrying: '↻',
  completed: '✓',
  failed: '✗',
  cancelled: '–',
};

export function TaskPanel({ tasks }: TaskPanelProps): React.ReactElement {
  if (tasks.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Tasks</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>(no active tasks)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Tasks ({tasks.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </Box>
    </Box>
  );
}

function TaskRow({ task }: { task: TaskViewModel }): React.ReactElement {
  const color = STATUS_COLORS[task.status] ?? defaultTheme.muted;
  const icon = STATUS_ICONS[task.status] ?? '?';

  return (
    <Box gap={1}>
      <Text color={color}>{icon}</Text>
      <Text color={defaultTheme.text}>{task.title}</Text>
      <Text color={color}>{task.status.padEnd(9)}</Text>
      <Text color={defaultTheme.muted}>{task.elapsedText.padStart(8)}</Text>
      {task.retryCount > 0 && (
        <Text color={defaultTheme.warning}>retry:{task.retryCount}</Text>
      )}
      {task.isStuck && <Text color={defaultTheme.danger}>STUCK</Text>}
    </Box>
  );
}
