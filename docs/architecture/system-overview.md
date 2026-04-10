---
id: ARCH-SYSTEM-OVERVIEW
title: "CCMonit 시스템 개요"
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, overview]
links:
  - event-flow.md
  - ../knowledge/overview/project-map.md
---
# CCMonit 시스템 개요

이 문서는 CCMonit의 전체 시스템 구성을 빠르게 이해하기 위한 요약 문서다.

## 한 줄 요약
Claude Code / harness / filesystem 에서 발생하는 신호를 수집해 canonical event 로 정규화하고, 이를 저장·집계·표시하는 TUI 중심 모니터링 도구다.

## 핵심 흐름
1. adapter 가 raw 로그와 파일 활동을 수집한다.
2. parser / extractor 가 raw 입력을 canonical event 로 정규화한다.
3. event store 가 append-only 방식으로 이벤트를 저장한다.
4. application / domain 계층이 세션 요약, 토큰 집계, 알림 탐지를 수행한다.
5. presenter 와 TUI 가 read model 을 화면에 표현한다.
6. reporter 가 세션 종료 후 markdown/json/csv 리포트를 만든다.

## 설계 원칙
- 외부 로그 포맷과 내부 도메인 이벤트를 분리한다.
- 현재 상태보다 이벤트 저장을 우선한다.
- 토큰 수치의 정확도(exact / derived / estimated / unavailable)를 모델에 포함한다.
- UI는 표시만 담당하고, 판단은 domain/application 이 가진다.
- 초기에는 단일 세션 중심으로 시작하되, replay 와 multi-session 확장을 막지 않는다.

## 계층 요약
- `apps/cli`: 프로그램 시작, 커맨드, TUI 조립
- `packages/domain`: 엔티티, 값 객체, 도메인 계산 규칙
- `packages/application`: 유스케이스, 포트, DTO
- `packages/infra`: 로그 감시, 파서, 저장소, 리포트, 텔레메트리
- `packages/shared`: 공통 타입, 상수, 에러, 유틸
- `packages/config`: 설정 해석 및 기본값 제공

## 읽어볼 문서
- `docs/product/PRD.md`
- `docs/architecture/event-flow.md`
- `docs/architecture/storage-model.md`
- `docs/architecture/adapter-contract.md`
- `docs/decisions/ADR-001-monorepo-structure.md`