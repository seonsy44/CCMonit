---
name: scope-map
description: 특정 영역의 관련 파일, 책임, 의존, 위험을 읽기 전용으로 빠르게 맵핑한다. 구현 전에 영향 범위를 좁히고 싶을 때 사용한다.
argument-hint: [영역 또는 기능명]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

대상 영역: **$ARGUMENTS**

## 목적
구현 전에 관련 파일 / 모듈 / 의존관계를 좁은 범위로 파악한다. 절대 구현하지 말고 읽기 전용 탐색만 수행한다.

## 수행 절차
1. `docs/index.md`, 관련 `docs/architecture/*` 또는 `docs/product/*`, `.claude/context/*.md`, 필요 시 `.claude/skills/_shared/*.md`를 먼저 확인한다.
2. 관련 엔트리 파일, 인터페이스, 타입, 문서 파일을 찾는다.
3. 직접 수정 후보 파일과 간접 영향 파일을 분리한다.
4. 각 파일의 책임을 1줄씩 요약한다.
5. 이번 배치에서 실제로 바꿔야 할 최소 파일 집합을 추천한다.
6. docs 같이 수정해야 할 후보 문서를 정리한다.
7. 위험 요소와 모호한 점을 정리한다.

## 제한
- 구현 금지
- 리팩터링 제안은 최소화
- 새로운 아키텍처 제안보다 현 구조 적합성을 우선

## 출력 형식
### Scope Map
- Primary files:
- Secondary files:
- Existing responsibilities:
- Minimal change set:
- Docs candidates:
- Risks:
- Unknowns:
- Recommended next skill:
