import type { TaskSummaryItem } from '@ccmonit/application/dto/task-summary-item.dto.js';
import { formatDuration } from '@ccmonit/shared/utils/format-duration.js';

export interface TaskViewModel {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly elapsedText: string;
  readonly retryCount: number;
  readonly isStuck: boolean;
}

export class TaskPresenter {
  toViewModels(items: readonly TaskSummaryItem[]): TaskViewModel[] {
    return items.map((t, i) => ({
      id: `T-${i + 1}`,
      title: t.title,
      status: t.status,
      elapsedText: formatDuration(t.elapsedSec * 1000),
      retryCount: t.retryCount,
      isStuck: t.isStuck,
    }));
  }
}
