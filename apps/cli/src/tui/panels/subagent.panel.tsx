import React from 'react';
import { Box, Text } from 'ink';
import type { AgentViewModel } from '../../presenters/subagent.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SubagentPanelProps {
  readonly agents: readonly AgentViewModel[];
}

const STATUS_COLORS: Record<string, string> = {
  running: defaultTheme.success,
  waiting: defaultTheme.warning,
  idle: defaultTheme.muted,
  completed: defaultTheme.muted,
  failed: defaultTheme.danger,
};

const STATUS_ICONS: Record<string, string> = {
  running: '●',
  waiting: '◐',
  idle: '○',
  completed: '✓',
  failed: '✗',
};

export function SubagentPanel({ agents }: SubagentPanelProps): React.ReactElement {
  if (agents.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Agents</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>(no agents)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Agents ({agents.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {agents.map((a) => (
          <AgentRow key={a.id} agent={a} />
        ))}
      </Box>
    </Box>
  );
}

function AgentRow({ agent }: { agent: AgentViewModel }): React.ReactElement {
  const color = STATUS_COLORS[agent.status] ?? defaultTheme.muted;
  const icon = STATUS_ICONS[agent.status] ?? '?';

  return (
    <Box gap={1}>
      <Text color={color}>{icon}</Text>
      <Text color={defaultTheme.text}>{agent.roleName}</Text>
      <Text color={color}>{agent.status.padEnd(9)}</Text>
      <Text color={defaultTheme.muted}>{agent.elapsedText.padStart(8)}</Text>
      <Text color={defaultTheme.muted}>{agent.lastActivityText}</Text>
    </Box>
  );
}
