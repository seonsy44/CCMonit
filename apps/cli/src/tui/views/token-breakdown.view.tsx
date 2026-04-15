import React from 'react';
import { Box, Text } from 'ink';
import type { TokenBreakdownViewModel } from '../../presenters/token.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface TokenBreakdownViewProps {
  readonly breakdown: TokenBreakdownViewModel;
}

const ACCURACY_COLORS: Record<string, string> = {
  exact: defaultTheme.success,
  derived: defaultTheme.text,
  estimated: defaultTheme.warning,
  unavailable: defaultTheme.muted,
};

export function TokenBreakdownView({ breakdown }: TokenBreakdownViewProps): React.ReactElement {
  const accuracyColor = ACCURACY_COLORS[breakdown.accuracy] ?? defaultTheme.muted;

  return (
    <Box flexDirection="column">
      <Text bold>Tokens</Text>
      <Box marginTop={1} flexDirection="column">
        <Row label="Input" value={breakdown.inputText} />
        <Row label="Output" value={breakdown.outputText} />
        <Row label="Cache Read" value={breakdown.cacheReadText} />
        <Row label="Cache Write" value={breakdown.cacheWriteText} />
        <Box>
          <Text color={defaultTheme.muted}>{'─'.repeat(24)}</Text>
        </Box>
        <Box gap={1}>
          <Text color={defaultTheme.text}>{'Total'.padEnd(13)}</Text>
          <Text bold>{breakdown.totalText.padStart(8)}</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>Accuracy: </Text>
          <Text color={accuracyColor}>{breakdown.accuracy}</Text>
        </Box>
      </Box>
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <Box gap={1}>
      <Text color={defaultTheme.muted}>{label.padEnd(13)}</Text>
      <Text color={defaultTheme.text}>{value.padStart(8)}</Text>
    </Box>
  );
}
