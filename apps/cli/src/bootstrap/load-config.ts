import type { CcmonitConfig } from '@ccmonit/shared/config/config.types.js';
import { defaultConfig } from '@ccmonit/shared/constants/default-config.js';

export async function loadConfig(): Promise<CcmonitConfig> {
  // TODO: 파일 / env 기반 설정 로딩 — 현재는 기본값 사용
  return { ...defaultConfig };
}
