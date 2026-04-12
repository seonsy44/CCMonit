import { open } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';

export interface FileTailOptions {
  /** 파일 처음부터 읽을지 여부. 기본값: false (끝부터 시작) */
  fromStart?: boolean;
  /** 새 내용 확인 주기 (ms). 기본값: 250 */
  pollIntervalMs?: number;
  /** 종료 시그널 */
  signal?: AbortSignal;
}

/**
 * 파일을 tail -f 방식으로 읽어 줄 단위로 yield하는 async generator.
 *
 * - 기본적으로 파일 끝에서부터 시작하며, fromStart=true로 처음부터 읽을 수 있다.
 * - 파일 크기가 줄어들면(truncation/rotation) 처음부터 다시 읽는다.
 * - signal이 abort되면 정상 종료한다.
 * - 불완전한 마지막 줄(개행 없음)은 다음 데이터가 올 때까지 버퍼링한다.
 */
export async function* fileTail(
  path: string,
  options: FileTailOptions = {},
): AsyncGenerator<string> {
  const { fromStart = false, pollIntervalMs = 250, signal } = options;

  const fh = await open(path, 'r');
  try {
    let offset = fromStart ? 0 : (await fh.stat()).size;
    let buffer = '';

    while (!signal?.aborted) {
      const { size } = await fh.stat();

      // 파일이 truncate 되었으면 처음부터 다시 읽는다
      if (size < offset) {
        offset = 0;
        buffer = '';
      }

      if (size > offset) {
        const readSize = size - offset;
        const buf = Buffer.alloc(readSize);
        const { bytesRead } = await fh.read(buf, 0, readSize, offset);
        offset += bytesRead;

        buffer += buf.toString('utf8', 0, bytesRead);
        const lines = buffer.split('\n');
        // 마지막 요소는 불완전한 줄일 수 있으므로 버퍼에 보관
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.length > 0) {
            yield line;
          }
        }
      } else {
        // 새 데이터가 없으면 대기
        try {
          await delay(pollIntervalMs, undefined, { signal });
        } catch {
          // AbortError — 루프 조건에서 종료 처리
          break;
        }
      }
    }
  } finally {
    await fh.close();
  }
}
