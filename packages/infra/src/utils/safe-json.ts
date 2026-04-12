/**
 * JSON.parse를 안전하게 수행한다.
 * 파싱 실패 시 예외 대신 null을 반환하여 adapter가 한 줄의 파싱 실패로 중단되지 않도록 한다.
 */
export function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
