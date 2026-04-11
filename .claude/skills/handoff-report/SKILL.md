---
name: handoff-report
description: 큰 세션이나 복잡한 변경 뒤에 사람에게 넘길 수 있는 보고서형 handoff를 만든다. 선택적으로 사용한다.
argument-hint: [대상 범위 또는 마일스톤]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

대상 범위: **$ARGUMENTS**

## 목적
긴 작업을 여러 세션으로 쪼개는 환경에서 현재 상태를 사람이 빠르게 파악할 수 있게 **보고서형 정리**를 만든다.

## 사용 시점
- 변경 파일이 많았을 때
- 구조 판단이 같이 있었을 때
- 며칠 뒤 다시 볼 가능성이 높을 때
- 다른 사람에게 넘길 가능성이 있을 때

## 포함 항목
- 지금까지 끝난 것
- 아직 남은 것
- 구현된 계층
- 미연결 지점
- 위험 요소
- docs 갱신 필요 항목
- 다음 추천 배치 3개 이하

## 출력 형식
### Handoff Report
- Scope:
- Completed:
- In progress:
- Remaining:
- Risks:
- Docs follow-up:
- Next batches:
