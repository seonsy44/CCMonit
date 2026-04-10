---
id: OPS-RELEASE-READY
title: "릴리스 준비 체크리스트"
type: guide
status: active
owners: [operations]
updated: 2026-04-10
tags: [release, checklist]
links:
  - ../product/roadmap.md
  - ../reports/docs-health-baseline.md
---

# 릴리스 준비 체크리스트

## 제품 문서
- [ ] `product/PRD.md`의 범위와 실제 구현 방향이 크게 어긋나지 않는다
- [ ] `product/기능명세서.md`에 MVP 범위가 반영되어 있다
- [ ] `product/화면명세서.md`가 현재 TUI 구조와 크게 다르지 않다

## 아키텍처 문서
- [ ] `architecture/event-flow.md`와 실제 이벤트 모델이 어긋나지 않는다
- [ ] `architecture/adapter-contract.md`의 계약이 실제 포트 구조와 모순되지 않는다
- [ ] `architecture/module-responsibilities.md`의 책임 경계가 유지되고 있다

## 운영 문서
- [ ] `operations/token-strategy-guide.md`가 현재 지표 체계와 맞는다
- [ ] `operations/log-retention.md`의 보존 정책이 최신이다
- [ ] `operations/troubleshooting.md`에 최근 반복 이슈가 반영되어 있다

## 문서 시스템
- [ ] `index.md`와 `registry/page-index.md`가 최신이다
- [ ] 새 문서에 frontmatter가 있다
- [ ] 새 source가 `sources/`와 `registry/source-index.md`에 반영됐다
- [ ] 릴리스 전후 중요한 판단이 `log.md`에 남아 있다