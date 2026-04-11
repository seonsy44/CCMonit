/**
 * 시작~종료 시각 구간을 나타내는 값 객체.
 * endedAt은 종료 확정 전까지 undefined.
 * 값은 ISO 8601 문자열.
 */
export interface TimestampRange {
  readonly startedAt: string;
  readonly endedAt?: string;
}
