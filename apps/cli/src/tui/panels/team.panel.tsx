import React from 'react';
import { Box, Text } from 'ink';
import type { TeamViewModel } from '../../presenters/subagent.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface TeamPanelProps {
  readonly teams: readonly TeamViewModel[];
}

export function TeamPanel({ teams }: TeamPanelProps): React.ReactElement {
  if (teams.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Teams</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>(no teams)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Teams ({teams.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {teams.map((t) => (
          <TeamRow key={t.teamId} team={t} />
        ))}
      </Box>
    </Box>
  );
}

function TeamRow({ team }: { team: TeamViewModel }): React.ReactElement {
  return (
    <Box gap={1}>
      <Text color={defaultTheme.text}>{team.teamId}</Text>
      <Text color={defaultTheme.muted}>
        agents: {team.agentCount}
      </Text>
      {team.activeCount > 0 && (
        <Text color={defaultTheme.success}>
          active: {team.activeCount}
        </Text>
      )}
    </Box>
  );
}
