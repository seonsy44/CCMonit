---
name: implement-infra-batch
description: infra 계층의 작은 배치를 구현한다. adapter, storage, telemetry, report writer 등 기술 세부 구현에 사용한다.
argument-hint: [배치명 또는 어댑터명]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit Glob Grep Bash(mkdir *)
---

대상 배치: **$ARGUMENTS**

## 목표
`packages/infra` 아래에서 기술 구현을 작은 단위로 완성한다.

## 규칙
- canonical event 계약을 먼저 확인한다.
- 추출 정확도(exact/derived/estimated/unavailable)를 잃지 않는다.
- 실패/누락/불완전 데이터는 조용히 무시하지 말고 보수적으로 처리한다.
- 어댑터 health 또는 TODO를 남겨 관측 가능성을 유지한다.

## 권장 배치 예시
- claude event parser 1종
- token extractor 1개 경로
- sqlite store 1개 구현
- report writer 1종
- anomaly detector 최소 버전

## 출력 형식
### Infra Batch Result
- Batch:
- Files changed:
- Contracts touched:
- Failure handling:
- Follow-up: