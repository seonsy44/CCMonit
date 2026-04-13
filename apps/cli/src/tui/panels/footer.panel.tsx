import React from 'react';
import { Box, Text } from 'ink';
import { defaultTheme } from '../theme/default-theme.js';

export interface FooterPanelProps {
  readonly refreshIntervalMs: number;
}

const HOTKEYS = 'q: quit';

export function FooterPanel({ refreshIntervalMs }: FooterPanelProps): React.ReactElement {
  const intervalText = refreshIntervalMs >= 1000
    ? `${(refreshIntervalMs / 1000).toFixed(0)}s`
    : `${refreshIntervalMs}ms`;

  return (
    <Box justifyContent="space-between">
      <Text color={defaultTheme.muted}>{HOTKEYS}</Text>
      <Text color={defaultTheme.muted}>refresh: {intervalText}</Text>
    </Box>
  );
}
