# Dev List

## 프로젝트 상태 요약

도메인(엔티티 7개, 서비스 4개), 애플리케이션(유스케이스 6/7, 포트 5개, DTO 3개), 인프라(어댑터·저장소·메트릭 전체) 구현 완료. CLI DI 조립 완성. TUI는 3패널(Session Summary, Token Breakdown, Alerts) + 3프레젠터만 데이터 연결됨. 나머지 6패널(header, footer, team, task, skill, subagent, file-activity), 4뷰(event-log, session-detail, session-list, report-preview), 3커맨드(doctor, replay, report)가 스텁 상태. MVP 핵심 남은 작업: TUI 패널 구현 → 수동 검증.

최종 갱신: 2026-04-12

---

## 개발건 목록

| # | 개발건명 | slug | 예상 스프린트 | 긴급도 | 불확실성 | 선행 조건 | 비고 |
|---|----------|------|---------------|--------|----------|-----------|------|
| 1 | TUI 패널 구현 (나머지 6패널) | tui-panels-2 | header+footer, team+subagent, task+skill, file-activity | urgent | 낮음 | 없음 | 화면명세서 §3 기준. 프레젠터 신규 필요 |
| 2 | TUI 뷰 구현 (4뷰) | tui-views | event-log, session-detail, session-list, report-preview | normal | 보통 | tui-panels-2 일부 | 뷰 전환 라우팅 포함 |
| 3 | CLI 커맨드 구현 (doctor/replay/report) | cli-commands | doctor, report, replay | normal | 보통 | 없음 | replay는 replay-session UC 구현 필요 |
| 4 | 실제 Claude Code 로그 수동 검증 | manual-validation | smoke test, 실 로그 파싱 검증, 어댑터 에러 핸들링 | urgent | 높음 | tui-panels-2 최소 1스프린트 | 파서가 실제 로그와 맞는지 확인 필수 |
| 5 | E2E 스모크 테스트 정비 | test-setup | 테스트 러너 선정, 스모크 테스트 확장, fixture 보강 | low | 낮음 | 없음 | 테스트 러너 미설정 상태 |
