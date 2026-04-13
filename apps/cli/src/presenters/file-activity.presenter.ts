import type { FileActivityItem } from '@ccmonit/application/dto/file-activity-item.dto.js';

export interface FileActivityViewModel {
  readonly filePath: string;
  readonly action: string;
  readonly timeText: string;
}

export class FileActivityPresenter {
  toViewModels(items: readonly FileActivityItem[]): FileActivityViewModel[] {
    return items.map((f) => ({
      filePath: truncatePath(f.filePath),
      action: f.action,
      timeText: new Date(f.occurredAt).toLocaleTimeString(),
    }));
  }
}

function truncatePath(path: string, maxLen = 40): string {
  if (path.length <= maxLen) return path;
  return `…${path.slice(-(maxLen - 1))}`;
}
