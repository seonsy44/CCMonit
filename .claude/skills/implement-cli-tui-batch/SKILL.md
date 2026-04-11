---
name: implement-cli-tui-batch
description: CLI/TUI 계층의 작은 배치를 구현한다. 하나의 패널, 뷰, 프레젠터, 커맨드 수준 작업에 사용한다.
argument-hint: [배치명 또는 패널/뷰명]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit Glob Grep
---

대상 배치: **$ARGUMENTS**

## 목표
`apps/cli`에서 사용자 가시화 계층의 아주 작은 조각을 구현한다.

## 규칙
- 한 번에 패널 1개, 뷰 1개, 프레젠터 1개 수준으로 제한한다.
- 데이터 계약은 application DTO 또는 presenter 출력에 맞춘다.
- 시각적 욕심보다 정보 구조를 우선한다.
- 복잡한 상호작용은 TODO로 뒤로 미룬다.

## 체크 포인트
- 입력 데이터는 무엇인가?
- 빈 상태 / 오류 상태 / 로딩 상태를 어떻게 표시할 것인가?
- token/alert/session 정보가 과도하게 섞이지 않았는가?

## 출력 형식
### CLI/TUI Batch Result
- Batch:
- Files changed:
- UI responsibility:
- States handled:
- Deferred interactions:
- Recommended next skill: