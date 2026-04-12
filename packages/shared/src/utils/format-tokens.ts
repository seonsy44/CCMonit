export function formatTokens(input: number | null | undefined): string {
  if (input == null || input === 0) return '0';
  if (input < 1_000) return String(input);
  if (input < 1_000_000) return `${(input / 1_000).toFixed(1)}K`;
  return `${(input / 1_000_000).toFixed(2)}M`;
}
