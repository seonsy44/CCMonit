# Dev List

## 프로젝트 상태 요약

도메인(엔티티 7개, 서비스 4개), 애플리케이션(유스케이스 7/7, 포트 5개, DTO 7개), 인프라(어댑터·저장소·메트릭 전체) 구현 완료. CLI DI 조립 완성. CLI 3커맨드(doctor/report/replay) 구현 완료. TUI 9패널 전체 구현 완료. 프레젠터 7개. 4뷰(event-log, session-detail, session-list, report-preview)가 스텁 상태. 실 로그 파싱 검증 완료(glob 패턴 수정, content 배열 처리, 에러 격리). MVP 핵심 남은 작업: tui-views → 최종 검증.

최종 갱신: 2026-04-13

---

## 개발건 목록

| # | 개발건명 | slug | 예상 스프린트 | 긴급도 | 불확실성 | 선행 조건 | 비고 |
|---|----------|------|---------------|--------|----------|-----------|------|
| 1 | TUI 뷰 구현 (4뷰) | tui-views | event-log, session-detail, session-list, report-preview | normal | 보통 | 없음 | 뷰 전환 라우팅 포함 |
| 2 | E2E 스모크 테스트 정비 | test-setup | 테스트 러너 선정, 스모크 테스트 확장, fixture 보강 | low | 낮음 | 없음 | 테스트 러너 미설정 상태 |
