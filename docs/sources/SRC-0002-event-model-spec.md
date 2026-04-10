---
id: SRC-0002
title: "이벤트 모델 명세"
type: source
status: active
owners: [architecture]
updated: 2026-04-10
tags: [source, events]
links: [[[architecture/event-flow]], [[knowledge/concepts/canonical-event]]]
---

# SRC-0002 이벤트 모델 명세

## source 정보
- 출처: `ccmonit_event_model_spec.md`
- 신뢰 수준: 아키텍처 기준 초안

## 핵심 포인트
- 외부 입력과 내부 canonical event를 분리한다.
- 저장은 append-only event stream을 우선한다.
- accuracy / confidence / source / evidence를 모델에 포함한다.
- UI는 raw event가 아니라 read model을 읽는다.

## 반영 대상
- [[architecture/event-flow]]
- [[knowledge/concepts/canonical-event]]
- [[knowledge/concepts/read-model]]
- [[knowledge/entities/session]]
- [[knowledge/entities/task]]
