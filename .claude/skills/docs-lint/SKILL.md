---
name: docs-lint
description: docs 위키의 orphan, stale, duplicate, missing-link, index 불일치 문제를 점검한다.
argument-hint: [점검 범위 또는 focus]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

점검 범위: **$ARGUMENTS**

## 목표
문서 시스템의 건강 상태를 점검하고, 다음 문서 정리 배치를 추천한다.

## 점검 항목
- index 에는 있는데 page-index 에 없는 문서
- 새 문서인데 source-index / log 반영이 누락된 경우
- 중복 설명이 과한 문서
- 고아 문서
- 오래된 `.claude/context/*` 요약
- 구현 구조와 docs 가 어긋난 흔적

## 출력 형식
### Docs Lint
- Scope checked:
- Healthy:
- Issues:
- Orphans:
- Stale candidates:
- Recommended next batch: