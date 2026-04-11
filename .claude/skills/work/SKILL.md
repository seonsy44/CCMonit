---
name: work
description: 코드 또는 문서의 실제 작업을 한 배치 단위로 수행한다
disable-model-invocation: true
---

# work

이 스킬은 이번 세션의 **메인 작업 스킬**이다. 범위 재확인, 작은 분할, 가벼운 검토를 내부에서 함께 처리한다.

## 입력

- `$ARGUMENTS`에는 이번 배치 대상을 짧게 준다.
- 예: `domain session entity`, `README cleanup`, `docs link repair`, `claude adapter parser stub`

## 먼저 읽을 것

- 작업 대상 관련 docs 파일 (`docs/architecture/`, `docs/knowledge/entities/`, `docs/operations/` 중 해당 파일)
  — 어떤 파일이 관련 있는지 모를 때는 `docs/index.md`를 먼저 확인한다
- 관련 코드 파일

> 참고: `.claude/context/*.md`는 session-start에서 이미 로드됨. 새 세션에서 work를 직접 시작할 경우에만 context/\*.md를 읽는다.

## 해야 할 일

1. 이번 배치 범위를 1문장으로 다시 확인한다.
2. 범위가 크면 내부적으로 한 단계 더 줄인다.
3. 실제 코드 또는 문서 작업을 수행한다.
4. 목표 대비 과도한 수정이 없는지 짧게 확인한다.
5. `docs-sync`가 필요한지 여부를 마지막에 표시한다.

## 출력 형식

- 이번 배치 범위 확인
- 수행한 작업 요약
- 수정 파일 목록
- 남은 리스크 / 다음 작은 배치
- `docs-sync 필요 여부`
