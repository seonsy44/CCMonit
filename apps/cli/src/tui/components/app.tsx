import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { BuildSessionSummaryUsecase } from '@ccmonit/application/usecases/build-session-summary.usecase.js';
import type { SessionPresenter, SessionViewModel } from '../../presenters/session.presenter.js';
import { TokenPresenter, type TokenBreakdownViewModel } from '../../presenters/token.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';
import { SummaryPanel } from '../panels/summary.panel.js';
import { TokenBreakdownView } from '../views/token-breakdown.view.js';

export interface AppProps {
  readonly sessionStore: SessionStorePort;
  readonly buildSummary: BuildSessionSummaryUsecase;
  readonly presenter: SessionPresenter;
  readonly refreshIntervalMs: number;
}

const tokenPresenter = new TokenPresenter();

export function App({
  sessionStore,
  buildSummary,
  presenter,
  refreshIntervalMs,
}: AppProps): React.ReactElement {
  const { exit } = useApp();
  const [sessions, setSessions] = useState<SessionViewModel[]>([]);
  const [tokenBreakdown, setTokenBreakdown] = useState<TokenBreakdownViewModel | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>('--:--:--');

  useInput((input) => {
    if (input === 'q') exit();
  });

  const refresh = useCallback(async () => {
    try {
      const recent = await sessionStore.listRecent(20);
      const viewModels: SessionViewModel[] = [];
      let primaryToken: TokenBreakdownViewModel | null = null;

      for (const session of recent) {
        const summary = await buildSummary.execute({
          sessionId: session.sessionId,
        });
        if (summary) {
          viewModels.push(presenter.toViewModel(summary));
          if (!primaryToken) {
            primaryToken = tokenPresenter.toViewModel(summary.tokens, summary.cost);
          }
        }
      }

      setSessions(viewModels);
      setTokenBreakdown(primaryToken);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      // 폴링 실패는 무시 — 다음 틱에서 재시도
    }
  }, [sessionStore, buildSummary, presenter]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), refreshIntervalMs);
    return () => clearInterval(id);
  }, [refresh, refreshIntervalMs]);

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={defaultTheme.border} paddingX={1}>
      {/* Header */}
      <Box justifyContent="space-between">
        <Box gap={1}>
          <Text bold color={defaultTheme.border}>
            ccmonit
          </Text>
          <Text color={defaultTheme.muted}>v0.0.0</Text>
        </Box>
        <Text color={defaultTheme.muted}>{lastRefresh}</Text>
      </Box>

      {/* Panels */}
      <Box marginTop={1} gap={4}>
        <Box flexGrow={1}>
          <SummaryPanel sessions={sessions} />
        </Box>
        {tokenBreakdown && (
          <Box>
            <TokenBreakdownView breakdown={tokenBreakdown} />
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box marginTop={1} justifyContent="center">
        <Text color={defaultTheme.muted}>q: quit</Text>
      </Box>
    </Box>
  );
}
