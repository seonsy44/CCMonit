---
id: OPS-DOCS-OPERATIONS
title: '문서 운영 가이드'
type: guide
status: active
owners: [operations]
updated: 2026-04-11
tags: [docs-system, operations]
links:
  - ../_system/MAINTENANCE_POLICY.md
  - ../reports/docs-health-baseline.md
  - claude-code-session-workflow.md
---

# 문서 운영 가이드

문서 시스템은 작성보다 **갱신과 통합**이 중요하다. 이 문서는 실제 유지보수 루틴을 정의한다.

## 세션 단위 운영

### 구현 세션 후

- 바뀐 기능이 있으면 `product/` 또는 `architecture/`를 갱신한다.
- 재사용 가치가 있는 개념이면 `knowledge/`에 남긴다.
- 회고 가치가 있는 관찰이면 `reports/queries/` 또는 `reports/`에 남긴다.
- `log.md`에 한 줄 이상 기록한다.
- Claude Code 작업 루틴과 어긋나면 `operations/claude-code-session-workflow.md`, `CLAUDE.md`, `.claude/*` 정합성을 점검한다.

### 질문 응답 후

- 단순 설명이면 채팅으로 끝낸다.
- 다시 물을 가능성이 있거나 여러 문서를 종합했다면 문서화한다.
- 문서화한 경우 `index.md` 또는 `registry/page-index.md`를 갱신한다.

## 주간 운영

- open question triage
- orphan 문서 점검
- 오래된 report 중 장기 가치 있는 내용을 synthesis로 승격
- 필요 없는 중복 문서 통합
- 릴리스 직전 문서와 구현 불일치 점검
- `.claude/context/*`와 docs 기준 문서가 낡았는지 비교
- 간소화된 스킬 구조(`kick-off`, `session-start`, `work`, `docs-sync`, `close-session`)와 문서 설명이 계속 맞는지 점검

## 권장 역할

- product: 기능 / 화면 / 범위 변경 점검
- architecture: 경계 / 계약 / 모델 변경 점검
- operations: 회고, 보존, 트러블슈팅 갱신
- docs-steward: index, registry, log, knowledge 구조 정리
- claude-operator: `.claude/*`, `CLAUDE.md`, `README.md`, docs 운영 흐름 정합성 점검

## 하지 말아야 할 운영

- 새 사실을 임시 메모에만 남기고 기준 문서를 갱신하지 않기
- 보고서를 계속 쌓아두고 장기 지식으로 승격하지 않기
- 같은 내용을 폴더마다 다른 말로 유지하기
- `.claude/context/*`가 낡았는데도 계속 예전 요약만 보고 작업하기
