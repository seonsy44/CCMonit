---
name: implement-domain-batch
description: domain 계층의 작은 배치를 구현한다. 엔티티, 값 객체, 도메인 서비스, 타입 정의 수준의 작업에 사용한다.
argument-hint: [배치명 또는 대상 엔티티]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit Glob Grep
---

대상 배치: **$ARGUMENTS**

## 목표
`packages/domain` 아래에서 작은 구현 단위를 완성한다.

## 우선 원칙
- 기존 문서와 현재 타입 구조를 먼저 읽는다.
- 도메인 의미를 먼저 고정하고 코드화한다.
- application/infra/TUI 계층으로 범위를 퍼뜨리지 않는다.
- 필요하면 TODO 주석으로 경계만 남기고 넘긴다.

## 수행 절차
1. 관련 도메인 파일과 문서를 읽는다.
2. 이번 배치의 도메인 책임을 3줄 이내로 고정한다.
3. 최소 수정으로 필요한 타입/엔티티/서비스를 구현한다.
4. 아직 연결되지 않은 후속 작업은 TODO나 문서로 남긴다.
5. 마지막에 변경 파일 목록과 후속 필요 작업을 요약한다.

## 금지
- application/infra/cli까지 연쇄 구현하지 말 것
- 범위 밖 리팩터링 금지
- 테스트 코드 작성 금지

## 출력 형식
### Domain Batch Result
- Batch:
- Files changed:
- What was implemented:
- Deferred work:
- Recommended next skill:
