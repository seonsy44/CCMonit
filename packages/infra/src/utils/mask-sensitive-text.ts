const REDACTED = '[REDACTED]';

/**
 * 민감 정보 패턴 목록.
 * 각 패턴은 RegExp + 대체 전략으로 구성한다.
 * 순서가 중요: 더 구체적인 패턴이 먼저 와야 한다.
 */
const PATTERNS: readonly RegExp[] = [
  // Anthropic / OpenAI / 일반 API 키 형태 (sk-ant-*, sk-*, pk-*)
  /\b(?:sk-ant-|sk-|pk-)[A-Za-z0-9_-]{20,}\b/g,

  // Bearer 토큰
  /Bearer\s+[A-Za-z0-9._\-/+=]{16,}/gi,

  // 일반적인 시크릿 환경변수 할당 (KEY=value 형태)
  /(?:API_KEY|SECRET|TOKEN|PASSWORD|AUTH|CREDENTIAL|PRIVATE_KEY)\s*=\s*\S+/gi,

  // GitHub 토큰
  /\b(?:ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9_]{36,}\b/g,

  // AWS 키
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
];

/**
 * 입력 문자열에서 민감 정보를 마스킹한다.
 * 저장 또는 표시 전에 호출하여 API 키, 토큰, 시크릿 등이 노출되지 않도록 한다.
 */
export function maskSensitiveText(input: string): string {
  let result = input;
  for (const pattern of PATTERNS) {
    // RegExp에 g 플래그가 있으므로 lastIndex 리셋
    pattern.lastIndex = 0;
    result = result.replace(pattern, REDACTED);
  }
  return result;
}
