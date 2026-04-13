import React from 'react';
import { Box, Text } from 'ink';
import type { SkillViewModel } from '../../presenters/skill.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface SkillPanelProps {
  readonly skills: readonly SkillViewModel[];
}

const STATUS_COLORS: Record<string, string> = {
  detected: defaultTheme.muted,
  running: defaultTheme.success,
  waiting: defaultTheme.warning,
  completed: defaultTheme.muted,
  failed: defaultTheme.danger,
  cancelled: defaultTheme.muted,
};

export function SkillPanel({ skills }: SkillPanelProps): React.ReactElement {
  if (skills.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Skills</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>(no skills)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Skills ({skills.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {skills.map((s) => (
          <SkillRow key={s.id} skill={s} />
        ))}
      </Box>
    </Box>
  );
}

function SkillRow({ skill }: { skill: SkillViewModel }): React.ReactElement {
  const color = STATUS_COLORS[skill.status] ?? defaultTheme.muted;

  return (
    <Box gap={1}>
      <Text color={defaultTheme.text}>{skill.skillName}</Text>
      <Text color={defaultTheme.muted}>@ {skill.startedAtText}</Text>
      <Text color={color}>{skill.status}</Text>
      {skill.toolCallCount > 0 && (
        <Text color={defaultTheme.muted}>tools:{skill.toolCallCount}</Text>
      )}
    </Box>
  );
}
