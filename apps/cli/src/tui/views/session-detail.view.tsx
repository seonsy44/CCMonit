import React from 'react';
import { Box, Text } from 'ink';
import type { HeaderViewModel } from '../../presenters/header.presenter.js';
import type { TokenBreakdownViewModel } from '../../presenters/token.presenter.js';
import type { AgentViewModel } from '../../presenters/subagent.presenter.js';
import type { TaskViewModel } from '../../presenters/task.presenter.js';
import type { SkillViewModel } from '../../presenters/skill.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SessionDetailViewProps {
  readonly header: HeaderViewModel | null;
  readonly tokenBreakdown: TokenBreakdownViewModel | null;
  readonly agents: readonly AgentViewModel[];
  readonly tasks: readonly TaskViewModel[];
  readonly skills: readonly SkillViewModel[];
  readonly alertCount: number;
}

export function SessionDetailView({
  header,
  tokenBreakdown,
  agents,
  tasks,
  skills,
  alertCount,
}: SessionDetailViewProps): React.ReactElement {
  if (!header) {
    return (
      <Box flexDirection="column">
        <Text bold>Session Detail</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>No session data available</Text>
        </Box>
      </Box>
    );
  }

  const activeTasks = tasks.filter((t) => t.status === 'running' || t.status === 'waiting');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const failedTasks = tasks.filter((t) => t.status === 'failed');

  return (
    <Box flexDirection="column">
      <Text bold>Session Detail</Text>

      {/* Session info */}
      <Box marginTop={1} flexDirection="column">
        <InfoRow label="Session ID" value={header.sessionId} />
        <InfoRow label="Model" value={header.model} />
        <InfoRow label="Working Dir" value={header.cwd} />
        <InfoRow label="Status" value={header.status} />
        <InfoRow label="Elapsed" value={header.elapsedText} />
        <InfoRow label="Idle" value={header.idleText} />
      </Box>

      {/* Tokens */}
      {tokenBreakdown && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color={defaultTheme.border}>Tokens</Text>
          <InfoRow label="Input" value={tokenBreakdown.inputText} />
          <InfoRow label="Output" value={tokenBreakdown.outputText} />
          <InfoRow label="Cache Read" value={tokenBreakdown.cacheReadText} />
          <InfoRow label="Cache Write" value={tokenBreakdown.cacheWriteText} />
          <InfoRow label="Total" value={tokenBreakdown.totalText} />
          <InfoRow label="Cost" value={tokenBreakdown.costText} />
          <InfoRow label="Accuracy" value={tokenBreakdown.accuracy} />
        </Box>
      )}

      {/* Counts */}
      <Box marginTop={1} flexDirection="column">
        <Text bold color={defaultTheme.border}>Summary</Text>
        <InfoRow label="Agents" value={String(agents.length)} />
        <InfoRow label="Tasks (active)" value={String(activeTasks.length)} />
        <InfoRow label="Tasks (completed)" value={String(completedTasks.length)} />
        <InfoRow label="Tasks (failed)" value={String(failedTasks.length)} />
        <InfoRow label="Skills" value={String(skills.length)} />
        <InfoRow label="Alerts" value={String(alertCount)} />
      </Box>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <Box gap={1}>
      <Text color={defaultTheme.muted}>{label.padEnd(16)}</Text>
      <Text color={defaultTheme.text}>{value}</Text>
    </Box>
  );
}
