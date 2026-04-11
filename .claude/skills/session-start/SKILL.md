---
name: session-start
description: 현재 문맥을 읽고 이번 세션 목표, 범위, stop line을 정리한다
disable-model-invocation: true
---

# session-start

이 스킬은 **선택한 작업을 실제 세션 계획으로 고정하는 시작 스킬**이다.

## 입력

- 가능하면 `$ARGUMENTS`에 이번 세션 목표를 짧게 준다.
- 예: `README cleanup`, `domain session entity`, `docs workflow cleanup`

## 먼저 읽을 것

- `.claude/context/*.md`
- `.claude/scratch/next-prompt.md`
- `.claude/scratch/worklog.md`
- `.claude/scratch/open-questions.md`

> 참고: kick-off 직후 실행 시 `.claude/context/*.md`는 이미 로드됨. 새 세션에서 session-start를 직접 시작할 경우에만 context/\*.md를 읽는다.

## 해야 할 일

1. 현재 상태를 짧게 요약한다.
2. 이번 세션 목표를 1문장으로 고정한다.
3. 수정 허용 범위를 제안한다.
4. 이번 세션 stop line을 정한다.
5. 바로 다음 단계에서 `work`가 다룰 배치를 1개만 제안한다.

## 출력 형식

- 현재 상태 요약
- 이번 세션 목표
- 수정 허용 범위
- stop line
- 다음 단계 `work` 입력 제안
