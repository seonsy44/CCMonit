---
name: flow-start
description: 이번 세션에서 할 작업 후보를 추천하고, 실행 순서와 stop line을 고정한다
disable-model-invocation: true
---

# flow-start

이 스킬은 세션을 시작할 때 쓴다. **무엇을 할지 추천(kick-off)** 하고, **이번 세션 계획을 고정(session-start)** 하는 두 역할을 한 번에 처리한다.

## 입력

- `$ARGUMENTS`는 optional. 없으면 기본 ccmonit 개발 흐름을 진행한다.
- 파라미터 예시:
  - (없음) — ccmonit 개발 계속
  - `docs 건강도 유지` — docs 품질 유지 흐름
  - `워크플로우 고도화` — 워크플로우 개선 흐름
  - `terminal 최초 화면 띄우기` — 특정 기능 개발 흐름

## scratch 경로 결정 (중요)

파라미터 유무에 따라 읽기/쓰기 scratch 경로가 달라진다:

| 입력 | scratch 경로 |
|------|-------------|
| 파라미터 없음 | `.claude/scratch/` (루트) |
| 파라미터 있음 | `.claude/scratch/flows/{slug}/` |

**slug 변환**: 파라미터를 영문 kebab-case로 변환한다.
- `docs 건강도 유지` → `docs-health`
- `워크플로우 고도화` → `workflow-improve`
- `terminal 최초 화면 띄우기` → `terminal-first-screen`

해당 scratch 경로가 없으면 신규 흐름으로 취급하고, 이전 상태 없이 계획을 시작한다.

**notes.md는 항상 루트(`.claude/scratch/notes.md`)만 참조한다** — flow 무관 공통 주의사항이므로.

## 먼저 읽을 것

공통:
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- `.claude/context/glossary.md`
- `.claude/scratch/notes.md`

결정된 scratch 경로에서:
- `{scratch경로}/next-prompt.md`
- `{scratch경로}/worklog.md`
- `{scratch경로}/open-questions.md`

기본 흐름 또는 필요 시:
- `docs/index.md`, `docs/log.md`, `docs/registry/page-index.md`

## 해야 할 일

### 1단계: 작업 후보 추천

1. 현재 흐름(기본 or 파라미터)의 맥락을 짧게 파악한다.
   - 파라미터가 있으면 해당 흐름의 목적에 맞는 작업만 추천한다.
   - 파라미터가 없으면 ccmonit 개발 진행 상황에서 작업을 추천한다.
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
5. **현재 사용 중인 scratch 경로를 명시한다** (flow-work, flow-close에서 참조할 수 있도록).

## 출력 형식

**추천 단계:**
- 현재 흐름: `기본 개발` 또는 `{파라미터}` (scratch 경로 명시)
- 후보 1 `[넓은/보통/좁은 범위]` — 짧은 이유
- 후보 2 `[넓은/보통/좁은 범위]` — 짧은 이유
- 후보 3 `[넓은/보통/좁은 범위]` — (필요 시)

**계획 고정 단계 (작업 선택 후):**
- 이번 세션 작업 목록 (1. 작업A, 2. 작업B, ...)
- 세션 stop line
- 각 작업별 허용 범위
- 현재 scratch 경로: `.claude/scratch/` 또는 `.claude/scratch/flows/{slug}/`
- `flow-work` 실행 순서
