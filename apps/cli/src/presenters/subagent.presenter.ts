import type { AgentSummaryItem } from '@ccmonit/application/dto/agent-summary-item.dto.js';
import { formatDuration } from '@ccmonit/shared/utils/format-duration.js';

export interface AgentViewModel {
  readonly id: string;
  readonly roleName: string;
  readonly status: string;
  readonly elapsedText: string;
  readonly toolCallCount: number;
  readonly lastActivityText: string;
}

export interface TeamViewModel {
  readonly teamId: string;
  readonly agentCount: number;
  readonly activeCount: number;
}

export class SubagentPresenter {
  toAgentViewModels(items: readonly AgentSummaryItem[]): AgentViewModel[] {
    return items.map((a) => ({
      id: a.agentId.length > 8 ? a.agentId.slice(0, 8) : a.agentId,
      roleName: a.roleName,
      status: a.status,
      elapsedText: formatDuration(a.elapsedSec * 1000),
      toolCallCount: a.toolCallCount,
      lastActivityText: a.lastActivityAt
        ? new Date(a.lastActivityAt).toLocaleTimeString()
        : '-',
    }));
  }

  toTeamViewModels(items: readonly AgentSummaryItem[]): TeamViewModel[] {
    const teams = new Map<string, { count: number; active: number }>();

    for (const a of items) {
      const teamId = a.teamId ?? '(no team)';
      const entry = teams.get(teamId) ?? { count: 0, active: 0 };
      entry.count++;
      if (a.status === 'running' || a.status === 'waiting') entry.active++;
      teams.set(teamId, entry);
    }

    return Array.from(teams, ([teamId, { count, active }]) => ({
      teamId,
      agentCount: count,
      activeCount: active,
    }));
  }
}
