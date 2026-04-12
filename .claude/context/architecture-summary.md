# Architecture Summary

패키지 구조:

- `apps/cli`: CLI 엔트리와 TUI 프레젠테이션 계층
- `packages/domain`: 엔티티, 값 객체, 도메인 서비스
- `packages/application`: 유스케이스, DTO, 포트
- `packages/infra`: Claude adapter, storage, metrics, reports
- `packages/shared`: 공용 타입 / 에러 / 유틸 / 설정 스키마

핵심 흐름:
Raw input -> Adapter -> Parser / Extractor -> Canonical Event -> Event Store -> Projector / Usecase -> Presenter -> CLI / TUI / Reports

아키텍처 원칙:

- append-only event 저장
- 현재 상태는 projector / usecase 가 계산
- UI 는 read model 만 소비
- token accuracy 와 confidence 를 모델에 포함
- adapter 실패가 전체 앱 종료로 이어지지 않음
- raw 흔적과 canonical event 를 둘 다 보존

Source of truth:

- `docs/architecture/system-overview.md`
- `docs/architecture/event-flow.md`
- `docs/architecture/storage-model.md`
- `docs/architecture/adapter-contract.md`
- `docs/architecture/module-responsibilities.md`
