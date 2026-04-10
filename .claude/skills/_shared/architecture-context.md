# Architecture Context for Skills

모노레포 구조:
- `apps/cli`: CLI 엔트리와 TUI 프레젠테이션 계층
- `packages/domain`: 엔티티, 값 객체, 도메인 서비스
- `packages/application`: 유스케이스, DTO, 포트
- `packages/infra`: Claude adapter, storage, telemetry, reports
- `packages/shared`: 공용 타입 / 에러 / 유틸
- `packages/config`: 설정 스키마와 해석

핵심 흐름:
1. adapter가 raw 로그 / 상태를 감지
2. parser / extractor 가 canonical event 로 변환
3. event store / session store 에 저장
4. usecase / projector / presenter 가 read model 생성
5. CLI / TUI / reports 가 이를 소비

꼭 먼저 확인할 문서:
- `docs/index.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/event-flow.md`
- `docs/architecture/module-responsibilities.md`
