# CLAUDE.md

## Commands

```bash
pnpm dev      # apps/cli monitor 실행 (tsx)
pnpm smoke    # 스모크 테스트
pnpm lint     # ESLint
pnpm format   # Prettier
```

테스트 러너 미설정. `fixtures/`에 샘플 parsed event 있음.

## Architecture

pnpm workspaces 모노레포. 의존 방향:

```
CLI/TUI → Application → Domain
Infra   → Application Ports (구현)
Shared  → 전 레이어 (유틸, 에러, 상수)
```

- `packages/domain` — 엔티티, VO, 도메인 서비스. FS/SQLite/터미널 의존 금지.
  - 엔티티: `session`, `event`, `agent`, `task`, `skill`, `alert`, `token-usage`, `tool-usage`
  - VO: `session-id`, `duration`, `timestamp-range`, `token-accuracy`, `token-source`
  - 타입: `session-status`, `task-status`, `event-kind`, `actor-kind`, `panel-kind`
  - 서비스: `cost-estimation`, `session-health`, `stuck-detection`, `token-aggregation`
- `packages/application` — 유스케이스, 포트, DTO, 매퍼.
  - 유스케이스: `ingest-event`, `build-session-summary`, `detect-alerts`, `generate-report`, `replay-session`, `start-monitoring`, `stop-monitoring`
  - 포트: `event-store`, `event-source`, `session-store`, `report-writer`, `clock`
  - DTO: `session-summary`, `token-breakdown`, `report`
- `packages/infra` — 어댑터(claude-code 로그, filesystem), 저장소(NDJSON/SQLite/memory), 리포트 writer, metrics.
- `packages/shared` — 공통 유틸(`format-*`, `debounce`), 에러 타입, 상수, 유틸리티 타입, 설정 스키마/해석.
- `apps/cli` — 진입점, 커맨드(`monitor`/`report`/`replay`/`doctor`), TUI 패널/뷰, 프레젠터.

핵심 규칙: **Adapter는 읽고, Parser는 해석하고, Store는 저장하고, Projector는 계산하고, Alerting은 판단하고, TUI는 보여준다.** TUI에 도메인 로직 금지.

## 규칙

- source of truth는 `docs/`. `.claude/`는 보조 레이어다.
- 채팅 설명보다 문서와 파일 상태를 우선 신뢰한다.
- 범위를 먼저 고정하고, 그 다음에 구현한다.
- `.claude/` 내부에 source of truth를 새로 만들지 않는다.
- 세션 종료 시 `.claude/scratch/`가 다음 세션을 이어받을 수 있는 상태로 둔다.

## 워크플로우

세션 흐름 source of truth: `docs/operations/claude-code-session-workflow.md`

빠른 참조: `/kick-off` → `/session-start [목표]` → `/work [배치]` → `/docs-sync` (선택) → `/close-session`
