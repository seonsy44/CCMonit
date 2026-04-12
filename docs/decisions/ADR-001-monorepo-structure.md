---
id: ADR-001
title: 'ADR-001: 모노레포 구조 채택'
type: decision
status: active
owners: [architecture]
updated: 2026-04-10
tags: [adr, monorepo]
links:
  - ../architecture/module-responsibilities.md
---

# ADR-001: 모노레포 구조 채택

## 상태

승인 초안

## 맥락

CCMonit은 CLI, TUI, domain, adapter, config, 공통 유틸이 빠르게 분화될 가능성이 높다.
초기부터 모듈 책임을 명확히 하지 않으면 Claude Code가 한 파일에 과도하게 코드를 몰아넣을 가능성이 있다.

## 결정

다음과 같은 모노레포 구조를 채택한다.

- `apps/cli`: 실행 조립
- `packages/domain`: 핵심 모델과 규칙
- `packages/application`: 유스케이스와 포트
- `packages/infra`: 외부 연동과 저장소
- `packages/shared`: 공통
- `packages/config`: 설정

## 결과

장점:

- 변경 이유 분리
- Claude Code 작업 단위 명확화
- adapter 교체와 TUI 변경의 충돌 감소

단점:

- 초기 파일 수 증가
- 소규모 MVP 에서 과해 보일 수 있음

## 후속

MVP 구현이 지나치게 느려지면, application/infra 일부를 임시 단순화할 수 있다.
다만 domain 과 adapter 경계는 유지한다.
