export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number,
): (...args: TArgs) => void {
  void fn;
  void delayMs;
  throw new Error('Not implemented');
}
