import React from 'react';
import { Box, Text } from 'ink';
import type { ViewKind } from '../types/view-kind.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface FooterPanelProps {
  readonly refreshIntervalMs: number;
  readonly currentView: ViewKind;
}

const DASHBOARD_HOTKEYS = 'q: quit | l: sessions | e: events | r: report';
const VIEW_HOTKEYS = 'Esc: back | q: quit';

export function FooterPanel({ refreshIntervalMs, currentView }: FooterPanelProps): React.ReactElement {
  const intervalText = refreshIntervalMs >= 1000
    ? `${(refreshIntervalMs / 1000).toFixed(0)}s`
    : `${refreshIntervalMs}ms`;

  const hotkeys = currentView === 'dashboard' ? DASHBOARD_HOTKEYS : VIEW_HOTKEYS;

  return (
    <Box justifyContent="space-between">
      <Text color={defaultTheme.muted}>{hotkeys}</Text>
      <Text color={defaultTheme.muted}>refresh: {intervalText}</Text>
    </Box>
  );
}
