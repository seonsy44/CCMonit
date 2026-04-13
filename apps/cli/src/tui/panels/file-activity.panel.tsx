import React from 'react';
import { Box, Text } from 'ink';
import type { FileActivityViewModel } from '../../presenters/file-activity.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';

export interface FileActivityPanelProps {
  readonly files: readonly FileActivityViewModel[];
}

const ACTION_COLORS: Record<string, string> = {
  created: defaultTheme.success,
  updated: defaultTheme.text,
  deleted: defaultTheme.danger,
  changed: defaultTheme.text,
};

export function FileActivityPanel({ files }: FileActivityPanelProps): React.ReactElement {
  if (files.length === 0) {
    return (
      <Box flexDirection="column">
        <Text bold>File Activity</Text>
        <Box marginTop={1}>
          <Text color={defaultTheme.muted}>watching for changes...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold>File Activity ({files.length})</Text>
      <Box marginTop={1} flexDirection="column">
        {files.map((f, i) => (
          <FileRow key={`${f.filePath}-${i}`} file={f} />
        ))}
      </Box>
    </Box>
  );
}

function FileRow({ file }: { file: FileActivityViewModel }): React.ReactElement {
  const color = ACTION_COLORS[file.action] ?? defaultTheme.text;

  return (
    <Box gap={1}>
      <Text color={defaultTheme.muted}>{file.timeText}</Text>
      <Text color={defaultTheme.text}>{file.filePath}</Text>
      <Text color={color}>{file.action}</Text>
    </Box>
  );
}
