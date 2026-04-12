/**
 * SQLite 데이터베이스 추상 인터페이스.
 *
 * better-sqlite3의 Database와 호환되도록 설계했다.
 * bootstrap에서 실제 better-sqlite3 인스턴스를 생성하여 주입한다.
 * 이 인터페이스를 통해 infra 패키지가 better-sqlite3에 직접 의존하지 않는다.
 */
export interface SqliteDatabase {
  prepare<T = unknown>(sql: string): SqliteStatement<T>;
  exec(sql: string): void;
}

export interface SqliteStatement<T = unknown> {
  run(...params: unknown[]): SqliteRunResult;
  get(...params: unknown[]): T | undefined;
  all(...params: unknown[]): T[];
}

export interface SqliteRunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}
