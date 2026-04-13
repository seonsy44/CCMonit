# smoke-test 발견 사항

날짜: 2026-04-13
대상: manual-validation 스프린트 1 (smoke-test)

## 실 로그 디렉토리 구조

```
~/.claude/projects/{encoded-cwd}/
  {sessionId}.jsonl              ← 루트 세션 파일 (메인 대화)
  {sessionId}/
    subagents/
      agent-{id}.jsonl           ← 서브에이전트 파일
      agent-{id}.meta.json
```

- 루트 파일이 전체 데이터의 ~80% 차지 (검증 세션: 루트 720줄 vs 서브에이전트 169줄)
- UUID 중복 0건 — 루트와 서브에이전트 파일은 완전히 다른 메시지 포함

## 실 로그 라인 타입

| type | sessionId | 파서 처리 | 비고 |
|------|-----------|----------|------|
| user | ✓ | 세션/에이전트 감지, tool_result 파싱 | 메인 타입 |
| assistant | ✓ | 세션/에이전트 감지, tool_use 파싱, 토큰 추출 | 메인 타입 |
| system | ✓ | 세션 감지만 (무해) | system-reminder 등 |
| attachment | ✓ | 세션 감지만 (무해) | 파일 첨부 |
| custom-title | ✓ | 세션 감지만 (무해) | 세션 제목 설정 |
| agent-name | ✓ | 세션 감지만 (무해) | 에이전트 이름 |
| file-history-snapshot | ✗ | 드롭 (정상) | sessionId 없음 |

## 발견된 이슈

### CRITICAL: 루트 세션 파일 미감시

- **위치**: `ClaudeLogWatcher` (claude-log-watcher.ts:46)
- **현상**: glob 패턴 `**/subagents/agent-*.jsonl` → 루트 `{sessionId}.jsonl` 미매칭
- **영향**: 전체 데이터의 ~80% 유실. 서브에이전트 없는 세션은 0% 파싱
- **수정 방향**: glob 패턴에 `*.jsonl` 추가 또는 이중 패턴 (`*.jsonl` + `**/subagents/agent-*.jsonl`)

### MEDIUM: tool_result.content 배열 미처리

- **위치**: `ClaudeEventParser.parseContentBlock()` (claude-event-parser.ts:149)
- **현상**: `typeof block.content === 'string' ? block.content : ''`
- **실제 포맷**: `content`가 `[{type:"text", text:"..."}]` 배열인 경우 존재
- **영향**: `tool.finished` 이벤트의 `output_preview`가 빈 문자열
- **빈도**: 전체 tool_result 중 ~1.3% (238건 중 3건이 배열). 대부분은 string.
- **수정 방향**: 배열일 때 text 블록 결합

### LOW: 확장된 usage 필드 미활용

- **위치**: `ClaudeTokenExtractor` (claude-token-extractor.ts)
- **현상**: 실 로그의 `usage`에 `server_tool_use`, `service_tier`, `cache_creation` 하위 필드, `iterations`, `speed` 등 추가 필드 존재
- **영향**: 기본 토큰 카운트는 정확히 추출됨. 고급 메트릭만 누락
- **수정 필요성**: MVP에서는 불필요. 향후 고려

### LOW: thinking 콘텐츠 블록

- **현상**: `type: "thinking"` 블록이 assistant 메시지에 포함됨
- **영향**: 없음 — 파서가 tool_use/tool_result만 처리하므로 정상 무시
- **수정 필요성**: 없음

## 검증 통계 (세션 01f72040)

```
루트 세션:  720줄 → 685 파싱, 35 드롭 (file-history-snapshot)
서브에이전트: 169줄 → 169 파싱, 0 드롭

생성된 이벤트:
  session.started:  1
  agent.started:    2
  token.updated:  314 (루트 217 + 서브 97)
  tool.started:   182
  tool.finished:  238
  task.started:    17
  task.updated:    34
```

## pnpm dev 기동

- TTY 미감지 시 정상 종료 (CLI 내부 실행 한계)
- `glob` 실험적 기능 경고 (node:fs/promises) — 기능에는 영향 없음
- 실 터미널 기동은 사용자 수동 검증 필요

## 다음 스프린트 (실 로그 파싱 검증) 우선순위

1. **glob 패턴 수정** → 루트 세션 파일 포함 (CRITICAL)
2. **tool_result.content 배열 처리** (MEDIUM)
3. (선택) 사용자 수동 `pnpm dev` 터미널 실행 검증
