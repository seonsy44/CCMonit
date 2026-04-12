---
name: flow-start
description: 이번 세션에서 할 작업 후보를 추천하고, 실행 순서와 stop line을 고정한다
disable-model-invocation: true
---

# flow-start

이 스킬은 세션을 시작할 때 쓴다. **무엇을 할지 추천(kick-off)** 하고, **이번 세션 계획을 고정(session-start)** 하는 두 역할을 한 번에 처리한다.

## 먼저 읽을 것

- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- `.claude/context/glossary.md`
- `.claude/scratch/next-prompt.md`
- `.claude/scratch/worklog.md`
- `.claude/scratch/open-questions.md`
- 필요 시 `docs/index.md`, `docs/log.md`, `docs/registry/page-index.md`

## 해야 할 일

### 1단계: 작업 후보 추천

1. 현재 프로젝트 상태를 짧게 파악한다.
2. 지금 바로 시작 가능한 작업 후보를 1~3개 추천도순으로 제안한다.
3. 각 후보에 대해 **불확실성**과 **패턴 반복도**를 판단하고, 범위 크기를 함께 적는다.  
   (기준: `docs/operations/claude-code-session-workflow.md` §1-1)
4. 동일 패턴의 작업이 여러 개면 묶음 후보로 제안할 수 있다.

### 2단계: 세션 계획 고정

사용자가 작업을 선택하면:

1. 이번 세션에서 처리할 작업 목록을 확정한다 (보통 2~3개, 각각 독립 커밋 단위).
2. 전체 세션 stop line을 정한다.
3. 각 작업의 실행 순서와 허용 범위를 제안한다.
4. 불확실성이 높은 작업이 포함된 경우, 해당 작업은 단독으로 1개만 처리한다.

## 출력 형식

**추천 단계:**
- 후보 1 `[넓은/보통/좁은 범위]` — 짧은 이유
- 후보 2 `[넓은/보통/좁은 범위]` — 짧은 이유
- 후보 3 `[넓은/보통/좁은 범위]` — (필요 시)

**계획 고정 단계 (작업 선택 후):**
- 이번 세션 작업 목록 (1. 작업A, 2. 작업B, ...)
- 세션 stop line
- 각 작업별 허용 범위
- `flow-work` 실행 순서
