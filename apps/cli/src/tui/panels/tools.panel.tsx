import React from 'react';
import { Box, Text } from 'ink';
import type { ToolViewModel } from '../../presenters/tools.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface ToolsPanelProps {
  readonly tools: readonly ToolViewModel[];
}

export function ToolsPanel({ tools }: ToolsPanelProps): React.ReactElement {
  if (tools.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>Tools</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>(no tool calls)</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>Tools</Text>
      <Box marginTop={1} flexDirection="row" flexWrap="wrap" columnGap={2}>
        {tools.map((t) => (
          <Box key={t.toolName} gap={1}>
            <Text color={t.hasErrors ? defaultTheme.danger : defaultTheme.text}>
              {t.toolName}
            </Text>
            <Text color={defaultTheme.muted}>{t.callCountText}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
