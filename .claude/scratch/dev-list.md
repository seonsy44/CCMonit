# Dev List

## 프로젝트 상태 요약

대시보드 2열 그리드 구조 구현 완료. user-req 기반으로 수직 단일열 레이아웃 전면 개편 + 세션 전환 UX 강화 예정. 비용(Cost/USD) 제거 대기 중.

최종 갱신: 2026-04-15

---

## 개발건 목록

| # | 개발건명 | slug | 예상 스프린트 | 긴급도 | 불확실성 | 선행 조건 | 비고 |
|---|----------|------|---------------|--------|----------|-----------|------|
| 1 | E2E 스모크 테스트 정비 | test-setup | 테스트 러너 선정, 스모크 테스트 확장, fixture 보강 | low | 낮음 | 없음 | 테스트 러너 미설정 상태 |
| 2 | 비용(Cost/USD) 전면 제거 | remove-cost | 코드 제거(domain→app→presenter→TUI→report→bootstrap), 문서 정비 | normal | 낮음 | 없음 | 토큰 계산만 유지. ~20개 파일 대상 |
| 3 | 대시보드 수직 레이아웃 개편 | dashboard-vertical | 레이아웃 구조 전환, 섹션별 포맷 구현, UI 폴리시 | normal | 보통 | 없음 | detail 화면 제거, 8개 섹션 수직 나열, T-{n} 패턴 포맷 |
| 4 | 세션 전환 UX | session-nav | 메인 화면 세션 스위칭, sessions 화면 리워크 | normal | 보통 | dashboard-vertical | ↑↓ 세션 전환, inactive 세션 report/delete |
