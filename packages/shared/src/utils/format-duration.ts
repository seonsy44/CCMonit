export function formatDuration(inputMs: number): string {
  const totalSec = Math.max(0, Math.floor(inputMs / 1000));
  if (totalSec < 60) return `${totalSec}s`;

  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min < 60) return sec > 0 ? `${min}m ${sec}s` : `${min}m`;

  const hr = Math.floor(min / 60);
  const remainMin = min % 60;
  return remainMin > 0 ? `${hr}h ${remainMin}m` : `${hr}h`;
}
