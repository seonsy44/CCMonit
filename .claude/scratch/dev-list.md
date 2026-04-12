# Dev List

## 프로젝트 상태 요약

도메인 엔티티 7개 모두 완성(2026-04-12). CLI 부트스트랩 완료로 `pnpm dev` TUI 실행 가능. 다음 레이어는 도메인 서비스 → 애플리케이션 포트/유스케이스 → 인프라 어댑터 → TUI 데이터 연결 순이다. `.claude/` 운영 레이어에 stale 참조와 읽기 중복이 일부 축적됨.

최종 갱신: 2026-04-12

---

## 개발건 목록

| # | 개발건명 | slug | 예상 스프린트 | 긴급도 | 불확실성 | 선행 조건 | 비고 |
|---|----------|------|---------------|--------|----------|-----------|------|
| 1 | 도메인 서비스 구현 | domain-services | (1) cost-estimation, (2) session-health + stuck-detection, (3) token-aggregation | normal | 낮음 | 없음 (엔티티 완성) | TeamId VO도 포함 가능 |
| 2 | 애플리케이션 포트/유스케이스 구현 | application-layer | (1) 포트 인터페이스 강화, (2) ingest-event + build-session-summary, (3) detect-alerts + generate-report | normal | 보통 | domain-services | 스텁 → 실제 로직 |
| 3 | 인프라 어댑터 구현 | infra-adapters | (1) Claude Code 로그 파서, (2) NDJSON 이벤트 스토어, (3) 파일 감시 어댑터 | normal | 높음 | application-layer 포트 확정 | 실제 데이터 흐름의 핵심 |
| 4 | TUI 패널 데이터 연결 | tui-panels | (1) session summary 패널, (2) token 패널, (3) alert 패널 | low | 보통 | application-layer + infra-adapters | UI 선행 조건 있음 |
| 5 | .claude 폴더 건강도 및 토큰 최적화 | claude-folder-health | (1) stale 콘텐츠 정리 + settings 수정, (2) 스킬 읽기 효율화 + 행동 점검, (3) 워크플로우 흐름 토큰 분석 + 스킬 수정 | normal | 낮음 | 없음 | user-req 기반. 선행 조건 없음 |

## 진행 중인 개발건

없음.
