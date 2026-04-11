# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 현재 상태

구현 전 스캐폴드. 타입 스텁과 TODO만 있고 실제 동작 로직은 미구현.

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
```

- `packages/domain` — 엔티티, VO, 도메인 서비스. FS/SQLite/터미널 의존 금지.
- `packages/application` — 유스케이스, 포트, DTO.
- `packages/infra` — 어댑터(claude-code 로그, filesystem), 저장소(NDJSON/SQLite/memory), 리포트 writer.
- `packages/config` — 설정 스키마 및 해석.
- `apps/cli` — 진입점, 커맨드(`monitor`/`report`/`replay`/`doctor`), TUI 패널/뷰, 프레젠터.

핵심 규칙: **Adapter는 읽고, Parser는 해석하고, Store는 저장하고, Projector는 계산하고, Alerting은 판단하고, TUI는 보여준다.** TUI에 도메인 로직 금지.

## Docs

`docs/`는 계속 갱신되는 위키. 구현/결정 후 관련 문서와 `docs/log.md`(append-only)를 갱신한다.

## 세션 워크플로우

세션 시작 시 읽기 순서:
1. `docs/index.md` → `docs/operations/claude-code-session-workflow.md`
2. `.claude/context/*.md`
3. `.claude/scratch/*`

권장 스킬 순서: `/session-start` → `/resume-next` → `/scope-map` → `/slice-work` → `implement-*` → `/manual-verify` → `/update-context` → `/handoff-report`

세션 종료 전 `.claude/scratch/`(worklog, next-prompt, open-questions) 반드시 갱신.
