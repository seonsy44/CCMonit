# CCMonit

CCMonit은 Claude Code 하네스 환경에서 **지금 어떤 작업이 진행 중인지**와 **토큰/도구 사용 흐름이 어떻게 누적되는지**를 터미널에서 관찰하기 위한 모니터링 도구 스캐폴드다.

## 목적

- 세션 / 에이전트 / 태스크 / 스킬 / 툴 호출의 현재 상태를 한눈에 파악
- 작업 단위 로그와 리플레이 가능한 이벤트 저장
- input / output / cache read / cache write / total token 추적
- stuck, retry loop, token spike, adapter health 같은 운영 이슈 감지
- Claude Code 세션에서 **적당히 싼 비용**으로도 끊김 없이 이어갈 수 있는 운영 구조 제공

## 현재 상태

이 저장소는 **구현 전 스캐폴드**이다.

- 문서: 위키형 `docs/` 문서 시스템 포함
- 코드: 타입, 책임, 파일 경계, TODO 중심 스텁만 포함
- 실제 동작 로직: 미구현

## 먼저 읽을 문서

### 사람용 진입

1. `README.md`
2. `docs/index.md`
3. `docs/_system/DOCS_SCHEMA.md`
4. `docs/registry/page-index.md`
5. `docs/operations/claude-code-session-workflow.md`

### Claude Code 진입

1. `CLAUDE.md`
2. `docs/operations/claude-code-session-workflow.md`
3. `.claude/README.md`
4. `.claude/context/*.md`
5. 필요 시 `.claude/skills/_shared/*.md`
6. `.claude/scratch/*`

## 폴더 개요

- `apps/cli`: 엔트리포인트와 TUI 조립 레이어
- `packages/domain`: 핵심 엔티티 / 값 객체 / 도메인 서비스
- `packages/application`: 유스케이스 / 포트 / DTO
- `packages/infra`: 어댑터 / 저장소 / 텔레메트리 / 유틸
- `packages/shared`: 공통 상수 / 에러 / 포맷터
- `packages/config`: 설정 스키마와 설정 해석
- `docs`: 지속 관리형 프로젝트 위키
- `.claude`: Claude Code 작업용 운영 레이어
- `CLAUDE.md`: Claude Code용 루트 진입 가이드

## 문서 시스템 운영 원칙

- `docs/`는 단순 산출물 묶음이 아니라 **계속 갱신되는 위키**다.
- 새 구현/결정/관찰이 생기면 관련 기준 문서와 `docs/log.md`를 갱신한다.
- 세션 후에는 `.claude/scratch/*`뿐 아니라 필요 시 `docs/`와 `.claude/context/*`도 함께 업데이트한다.
- `docs/index.md`는 콘텐츠 탐색용, `docs/registry/page-index.md`는 운영용 전체 목록, `docs/log.md`는 append-only 변경 기록이다.

## Claude Code 작업 루틴

상세 workflow source of truth는 `docs/operations/claude-code-session-workflow.md`이다.

기본 루프:

1. `/kick-off` — 지금 할 수 있는 작은 작업 1~3개 추천
2. `/session-start [선택한 목표]` — 이번 세션 범위와 stop line 정리
3. `/work [이번 배치]` — 코드 또는 문서 작업 수행
4. `/docs-sync [optional]` — docs / context / scratch에 장기 반영
5. `/close-session` — 다음 세션이 바로 이어질 수 있게 handoff 정리

핵심 규칙:

- `kick-off`는 **PM 역할**이다. 할 수 있는 일을 고르고 우선순위를 제안한다.
- `session-start`는 시작 시 현재 scratch와 docs를 읽고 이번 세션의 stop line을 맞춘다.
- `work`는 구현/정비/검토를 한 배치 안에서 처리하는 메인 스킬이다.
- `docs-sync`는 문서 반영이 필요할 때만 사용한다.
- `close-session`은 세션 **끝에서** 다음 세션용 handoff를 남길 때 쓴다.

## 제외 사항

사용자 요청에 따라 테스트 폴더와 테스트 라이브러리는 이번 스캐폴드에서 제외했다.
