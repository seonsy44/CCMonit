import type { ToolSummaryItem } from '@ccmonit/application/dto/tool-summary-item.dto.js';

export interface ToolViewModel {
  readonly toolName: string;
  readonly callCountText: string;
  readonly hasErrors: boolean;
  readonly errorCountText: string;
}

export class ToolsPresenter {
  toViewModels(items: readonly ToolSummaryItem[]): ToolViewModel[] {
    return items.map((item) => ({
      toolName: item.toolName,
      callCountText: String(item.callCount),
      hasErrors: item.errorCount > 0,
      errorCountText: item.errorCount > 0 ? `err:${item.errorCount}` : '',
    }));
  }
}
