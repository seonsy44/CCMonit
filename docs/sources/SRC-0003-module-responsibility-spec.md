---
id: SRC-0003
title: "모듈 책임 명세"
type: source
status: active
owners: [architecture]
updated: 2026-04-10
tags: [source, modules]
links:
  - ../architecture/module-responsibilities.md
  - ../registry/ownership-matrix.md
---

# SRC-0003 모듈 책임 명세

## source 정보
- 출처: `ccmonit_module_responsibility_spec.md`
- 신뢰 수준: 아키텍처 기준 초안

## 핵심 포인트
- 수집/해석/판단/표시 책임을 분리한다.
- domain, application, infra, presenter, TUI의 경계를 명시한다.
- bootstrap/config/command/adapter/parser/store/projector/reporting의 역할이 정의되어 있다.

## 반영 대상
- [architecture/module-responsibilities](../architecture/module-responsibilities.md)
- [registry/ownership-matrix](../registry/ownership-matrix.md)
- [decisions/ADR-001-monorepo-structure](../decisions/ADR-001-monorepo-structure.md)