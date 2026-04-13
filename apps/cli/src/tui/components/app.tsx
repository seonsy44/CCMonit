import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import type { SessionStorePort } from '@ccmonit/application/ports/session-store.port.js';
import type { BuildSessionSummaryUsecase } from '@ccmonit/application/usecases/build-session-summary.usecase.js';
import type { DetectAlertsUsecase } from '@ccmonit/application/usecases/detect-alerts.usecase.js';
import type { SessionPresenter, SessionViewModel } from '../../presenters/session.presenter.js';
import { TokenPresenter, type TokenBreakdownViewModel } from '../../presenters/token.presenter.js';
import { AlertPresenter, type AlertViewModel } from '../../presenters/alert.presenter.js';
import { defaultTheme } from '../theme/default-theme.js';
import { SummaryPanel } from '../panels/summary.panel.js';
import { TokenBreakdownView } from '../views/token-breakdown.view.js';
import { AlertsPanel } from '../panels/alerts.panel.js';
import { HeaderPanel } from '../panels/header.panel.js';
import { FooterPanel } from '../panels/footer.panel.js';
import { SubagentPanel } from '../panels/subagent.panel.js';
import { TeamPanel } from '../panels/team.panel.js';
import { TaskPanel } from '../panels/task.panel.js';
import { SkillPanel } from '../panels/skill.panel.js';
import { FileActivityPanel } from '../panels/file-activity.panel.js';
import { SessionListView } from '../views/session-list.view.js';
import { EventLogView } from '../views/event-log.view.js';
import type { ViewKind } from '../types/view-kind.js';
import { HeaderPresenter, type HeaderViewModel } from '../../presenters/header.presenter.js';
import type { AgentSummaryItem } from '@ccmonit/application/dto/agent-summary-item.dto.js';
import type { TaskSummaryItem } from '@ccmonit/application/dto/task-summary-item.dto.js';
import type { SkillSummaryItem } from '@ccmonit/application/dto/skill-summary-item.dto.js';
import {
  SubagentPresenter,
  type AgentViewModel,
  type TeamViewModel,
} from '../../presenters/subagent.presenter.js';
import { TaskPresenter, type TaskViewModel } from '../../presenters/task.presenter.js';
import { SkillPresenter, type SkillViewModel } from '../../presenters/skill.presenter.js';
import type { FileActivityItem } from '@ccmonit/application/dto/file-activity-item.dto.js';
import {
  FileActivityPresenter,
  type FileActivityViewModel,
} from '../../presenters/file-activity.presenter.js';
import type { EventLogItem } from '@ccmonit/application/dto/event-log-item.dto.js';
import {
  EventLogPresenter,
  type EventLogViewModel,
} from '../../presenters/event-log.presenter.js';

export interface AppProps {
  readonly sessionStore: SessionStorePort;
  readonly buildSummary: BuildSessionSummaryUsecase;
  readonly detectAlerts: DetectAlertsUsecase;
  readonly presenter: SessionPresenter;
  readonly refreshIntervalMs: number;
}

const tokenPresenter = new TokenPresenter();
const alertPresenter = new AlertPresenter();
const headerPresenter = new HeaderPresenter();
const subagentPresenter = new SubagentPresenter();
const taskPresenter = new TaskPresenter();
const skillPresenter = new SkillPresenter();
const fileActivityPresenter = new FileActivityPresenter();
const eventLogPresenter = new EventLogPresenter();

export function App({
  sessionStore,
  buildSummary,
  detectAlerts,
  presenter,
  refreshIntervalMs,
}: AppProps): React.ReactElement {
  const { exit } = useApp();
  const [sessions, setSessions] = useState<SessionViewModel[]>([]);
  const [header, setHeader] = useState<HeaderViewModel | null>(null);
  const [tokenBreakdown, setTokenBreakdown] = useState<TokenBreakdownViewModel | null>(null);
  const [agents, setAgents] = useState<AgentViewModel[]>([]);
  const [teams, setTeams] = useState<TeamViewModel[]>([]);
  const [tasks, setTasks] = useState<TaskViewModel[]>([]);
  const [skills, setSkills] = useState<SkillViewModel[]>([]);
  const [fileActivities, setFileActivities] = useState<FileActivityViewModel[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLogViewModel[]>([]);
  const [alerts, setAlerts] = useState<AlertViewModel[]>([]);
  const [lastRefresh, setLastRefresh] = useState<string>('--:--:--');
  const [currentView, setCurrentView] = useState<ViewKind>('dashboard');

  useInput((input, key) => {
    if (input === 'q') { exit(); return; }

    if (currentView !== 'dashboard') {
      if (key.escape) setCurrentView('dashboard');
      return;
    }

    // Dashboard navigation
    if (input === 'l') setCurrentView('session-list');
    if (input === 'e') setCurrentView('event-log');
    if (input === 'd') setCurrentView('session-detail');
    if (input === 'r') setCurrentView('report-preview');
  });

  const refresh = useCallback(async () => {
    try {
      const recent = await sessionStore.listRecent(20);
      const viewModels: SessionViewModel[] = [];
      let primaryToken: TokenBreakdownViewModel | null = null;
      const allAlerts: AlertViewModel[] = [];
      let allAgentItems: AgentSummaryItem[] = [];
      let allTaskItems: TaskSummaryItem[] = [];
      let allSkillItems: SkillSummaryItem[] = [];
      let allFileItems: FileActivityItem[] = [];
      let allEventItems: EventLogItem[] = [];

      for (const session of recent) {
        const summary = await buildSummary.execute({
          sessionId: session.sessionId,
        });
        if (summary) {
          viewModels.push(presenter.toViewModel(summary));
          if (!primaryToken) {
            primaryToken = tokenPresenter.toViewModel(summary.tokens, summary.cost);
            setHeader(headerPresenter.toViewModel(summary));
            allAgentItems = [...summary.agentSummaries];
            allTaskItems = [...summary.taskSummaries];
            allSkillItems = [...summary.skillSummaries];
            allFileItems = [...summary.fileActivities];
            allEventItems = [...summary.recentEvents];
          }
        }

        const result = await detectAlerts.execute({
          sessionId: session.sessionId,
        });
        for (const alert of result.alerts) {
          allAlerts.push(alertPresenter.toViewModel(alert));
        }
      }

      setSessions(viewModels);
      setTokenBreakdown(primaryToken);
      setAgents(subagentPresenter.toAgentViewModels(allAgentItems));
      setTeams(subagentPresenter.toTeamViewModels(allAgentItems));
      setTasks(taskPresenter.toViewModels(allTaskItems));
      setSkills(skillPresenter.toViewModels(allSkillItems));
      setFileActivities(fileActivityPresenter.toViewModels(allFileItems));
      setEventLogs(eventLogPresenter.toViewModels(allEventItems));
      setAlerts(allAlerts);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      // 폴링 실패는 무시 — 다음 틱에서 재시도
    }
  }, [sessionStore, buildSummary, detectAlerts, presenter]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), refreshIntervalMs);
    return () => clearInterval(id);
  }, [refresh, refreshIntervalMs]);

  const renderViewContent = (): React.ReactElement => {
    switch (currentView) {
      case 'session-list':
        return <SessionListView sessions={sessions} />;
      case 'event-log':
        return <EventLogView events={eventLogs} />;
      case 'session-detail':
      case 'report-preview':
        return (
          <Box marginTop={1}>
            <Text color={defaultTheme.muted}>
              {currentView} view — not yet implemented
            </Text>
          </Box>
        );
      default:
        return <></>;
    }
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={defaultTheme.border} paddingX={1}>
      {/* Header */}
      <HeaderPanel header={header} refreshedAt={lastRefresh} />

      {currentView === 'dashboard' ? (
        <>
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

          {/* Agents / Teams */}
          <Box marginTop={1} gap={4}>
            <Box flexGrow={1}>
              <SubagentPanel agents={agents} />
            </Box>
            <Box flexGrow={1}>
              <TeamPanel teams={teams} />
            </Box>
          </Box>

          {/* Skills / Tasks */}
          <Box marginTop={1} gap={4}>
            <Box flexGrow={1}>
              <SkillPanel skills={skills} />
            </Box>
            <Box flexGrow={1}>
              <TaskPanel tasks={tasks} />
            </Box>
          </Box>

          {/* File Activity / Alerts */}
          <Box marginTop={1} gap={4}>
            <Box flexGrow={1}>
              <FileActivityPanel files={fileActivities} />
            </Box>
            <Box flexGrow={1}>
              <AlertsPanel alerts={alerts} />
            </Box>
          </Box>
        </>
      ) : (
        <Box marginTop={1}>
          {renderViewContent()}
        </Box>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <FooterPanel refreshIntervalMs={refreshIntervalMs} currentView={currentView} />
      </Box>
    </Box>
  );
}
