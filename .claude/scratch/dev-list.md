# Dev List

## 프로젝트 상태 요약

도메인 엔티티 7개 + 도메인 서비스 4개 완성(2026-04-12). CLI 부트스트랩 완료로 `pnpm dev` TUI 실행 가능. 다음 레이어는 애플리케이션 포트/유스케이스 → 인프라 어댑터 → TUI 데이터 연결 순이다.

최종 갱신: 2026-04-12

---

## 개발건 목록

| # | 개발건명 | slug | 예상 스프린트 | 긴급도 | 불확실성 | 선행 조건 | 비고 |
|---|----------|------|---------------|--------|----------|-----------|------|
| 1 | 애플리케이션 포트/유스케이스 구현 | application-layer | (1) 포트 인터페이스 강화, (2) ingest-event + build-session-summary, (3) detect-alerts + generate-report | normal | 보통 | 없음 (도메인 서비스 완성) | 스텁 → 실제 로직 |
| 2 | 인프라 어댑터 구현 | infra-adapters | (1) Claude Code 로그 파서, (2) NDJSON 이벤트 스토어, (3) 파일 감시 어댑터 | normal | 높음 | application-layer 포트 확정 | 실제 데이터 흐름의 핵심 |
| 3 | TUI 패널 데이터 연결 | tui-panels | (1) session summary 패널, (2) token 패널, (3) alert 패널 | low | 보통 | application-layer + infra-adapters | UI 선행 조건 있음 |

