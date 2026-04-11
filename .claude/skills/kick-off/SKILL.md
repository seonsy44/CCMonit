---
name: kick-off
description: 지금 할 수 있는 작은 작업 후보를 추천하는 시작 스킬
disable-model-invocation: true
---

# kick-off

이 스킬은 **무엇을 할지 아직 정하지 못한 상태**에서 쓴다. 역할은 PM에 가깝다. 바로 구현을 길게 진행하지 말고, 지금 시작 가능한 작은 작업 1~3개를 추천한다.

## 먼저 읽을 것

- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- `.claude/context/glossary.md`
- 필요 시 `docs/index.md`, `docs/log.md`, `docs/registry/page-index.md`
- 필요 시 `.claude/scratch/*`

## 해야 할 일

1. 현재 프로젝트 상태를 짧게 파악한다.
2. 지금 바로 시작 가능한 작은 작업 후보를 1~3개 추천도순으로 제안한다.
3. 각 후보에 대해 수정 범위와 이유를 짧게 적는다.
4. 다음 단계에서 `session-start`에 넘길 목표 문장을 제안한다.

## 출력 형식

- 후보 1
- 후보 2
- 후보 3
- `session-start`에서 고정할 목표 / 범위 / stop line 초안
