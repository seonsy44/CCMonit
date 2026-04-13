import React from 'react';
import { Box, Text } from 'ink';
import type { HeaderViewModel } from '../../presenters/header.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface HeaderPanelProps {
  readonly header: HeaderViewModel | null;
  readonly refreshedAt: string;
}

export function HeaderPanel({ header, refreshedAt }: HeaderPanelProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      {/* Title row */}
      <Box justifyContent="space-between">
        <Box gap={1}>
          <Text bold color={defaultTheme.border}>
            ccmonit
          </Text>
          <Text color={defaultTheme.muted}>v0.0.0</Text>
        </Box>
        <Text color={defaultTheme.muted}>{refreshedAt}</Text>
      </Box>

      {/* Session info row */}
      {header ? (
        <>
          <Box gap={2}>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>session:</Text>
              <Text color={defaultTheme.text}>{header.sessionId}</Text>
            </Box>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>model:</Text>
              <Text color={defaultTheme.text}>{header.model}</Text>
            </Box>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>elapsed:</Text>
              <Text color={defaultTheme.text}>{header.elapsedText}</Text>
            </Box>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>idle:</Text>
              <Text color={defaultTheme.text}>{header.idleText}</Text>
            </Box>
          </Box>
          <Box gap={2}>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>cwd:</Text>
              <Text color={defaultTheme.text}>{header.cwd}</Text>
            </Box>
            <Box gap={1}>
              <Text color={defaultTheme.muted}>tokens:</Text>
              <Text color={defaultTheme.text}>
                in {header.inputText} / out {header.outputText} / total {header.totalText}
              </Text>
            </Box>
            <Text color={defaultTheme.muted}>{header.costText}</Text>
          </Box>
        </>
      ) : (
        <Text color={defaultTheme.muted}>Waiting for session...</Text>
      )}
    </Box>
  );
}
