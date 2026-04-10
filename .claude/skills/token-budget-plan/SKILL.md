---
name: token-budget-plan
description: 이번 세션 목표를 기준으로 읽기 비용과 수정 범위를 줄이는 토큰 예산 계획을 세운다.
argument-hint: [이번 세션 목표]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

이번 세션 목표: **$ARGUMENTS**

## 목표
저비용 플랜에서 이번 세션의 읽기 범위, 수정 파일 수, 검토 깊이를 사전에 줄인다.

## 수행 절차
1. `.claude/context/*.md`, 필요 시 `.claude/skills/_shared/*.md`, `.claude/scratch/*`, `docs/index.md`를 기준으로 꼭 읽어야 할 문서만 고른다.
2. 이번 세션의 최대 수정 파일 수를 제안한다.
3. 구현 / 탐색 / 문서 갱신 중 어디에 토큰을 쓸지 우선순위를 정한다.
4. 이번 세션에서 생략할 탐색을 명시한다.

## 출력 형식
### Token Budget Plan
- Must-read:
- Max files to edit:
- Budget focus:
- Skip for now:
