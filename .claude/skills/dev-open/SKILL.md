---
name: dev-open
description: dev-list의 개발건을 시작하고 스프린트 계획을 고정한다
disable-model-invocation: true
---

# dev-open

이 스킬은 **dev-list에 등록된 개발건을 시작**할 때 쓴다. 이번 세션에서 처리할 스프린트 목록을 확정하고 stop line을 고정한다.

**중요:** `dev-open`은 반드시 파라미터를 받아야 하며, `.claude/scratch/dev-list.md`에 있는 개발건만 시작할 수 있다. 개발건이 dev-list에 없으면 먼저 `/dev-kickoff`로 도출해야 한다.

## 입력

- `$ARGUMENTS` — 개발건 slug (**필수**, dev-list에 존재해야 함)
- 예: `domain-services`, `tui-first-screen`, `docs-health`

## scratch 경로 결정

`dev-open`은 항상 named 경로를 사용한다:

```
.claude/scratch/devs/{slug}/
```

해당 경로가 없으면 신규 개발건으로 취급하고 빈 상태에서 시작한다.

**notes.md는 항상 `.claude/scratch/notes.md`만 참조한다.**

## 먼저 읽을 것

공통:
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/model-effort-guide.md`
- `.claude/scratch/notes.md`
- `.claude/scratch/dev-list.md` (**필수** — slug 확인 및 예상 스프린트 참조)

> 참고: `dev-kickoff` 직후 같은 세션에서 실행할 경우, `docs/operations/claude-code-session-workflow.md`와 `.claude/context/*.md`는 이미 로드됨 — 재읽기 불필요. `notes.md`와 `dev-list.md`는 항상 읽는다.

결정된 scratch 경로에서 (있으면):
- `{scratch경로}/next-prompt.md`
- `{scratch경로}/worklog.md`
- `{scratch경로}/open-questions.md`

## 해야 할 일

### 1단계: dev-list 확인

1. `.claude/scratch/dev-list.md`를 읽고 파라미터 slug를 찾는다.
2. **slug가 없으면 중단**: "dev-list에 해당 개발건이 없습니다. `/dev-kickoff`로 먼저 개발건을 도출해주세요."
3. slug가 있으면 해당 개발건의 "예상 스프린트" 목록을 확인한다.

### 2단계: 스프린트 계획 고정

dev-list의 예상 스프린트를 기반으로 이번 세션 계획을 확정한다:

1. 이번 세션에서 처리할 스프린트 목록을 확정한다 (보통 2~3개, 각각 독립 커밋 단위).
   - dev-list의 예상 스프린트를 현재 프로젝트 상태에 맞게 조정해도 된다.
2. 세션 stop line을 정한다.
3. 각 스프린트의 실행 순서와 허용 범위를 제안한다.
4. 불확실성이 높은 스프린트가 포함된 경우, 해당 스프린트는 단독으로 1개만 처리한다.
5. 각 스프린트의 권장 model + effort를 결정한다 (`.claude/context/model-effort-guide.md` 참조).
6. **현재 사용 중인 scratch 경로를 명시한다** (dev-sprint, dev-close에서 참조).

## 출력 형식

- 현재 개발건: `{개발건명}` (scratch 경로: `.claude/scratch/devs/{slug}/`)
- 이번 세션 스프린트 목록 (1. 스프린트A `{model} + {effort}`, 2. 스프린트B, ...)
- 세션 stop line
- 각 스프린트별 허용 범위
- `dev-sprint` 실행 순서
