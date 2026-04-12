import React from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { defaultTheme } from '../theme/default-theme.js';

export function App(): React.ReactElement {
  const { exit } = useApp();

  useInput((input) => {
    if (input === 'q') exit();
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={defaultTheme.border}
      paddingX={1}
    >
      <Box justifyContent="center">
        <Text bold color={defaultTheme.border}>
          ccmonit
        </Text>
        <Text color={defaultTheme.muted}> v0.0.0</Text>
      </Box>
      <Box justifyContent="center" marginY={1}>
        <Text color={defaultTheme.muted}>No active sessions</Text>
      </Box>
      <Box justifyContent="center">
        <Text color={defaultTheme.muted}>q: quit</Text>
      </Box>
    </Box>
  );
}
