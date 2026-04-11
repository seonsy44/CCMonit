# CCMonit

Claude Code 하네스 환경을 위한 터미널 모니터링 도구 스캐폴드입니다.

## 목적

- 세션 / 에이전트 / 태스크 / 스킬 / 툴 호출의 현재 상태를 한눈에 파악
- 작업 단위 로그 및 리플레이 가능한 이벤트 저장
- input / output / cache read / cache write / total token 추적
- stuck, retry loop, token spike, adapter health 같은 운영성 이슈 감지

## 현재 상태

이 저장소는 **구현 전 스캐폴드** 입니다.

- 문서: 위키형 `docs/` 문서 시스템 포함
- 코드: 타입, 책임, 파일 경계, TODO 중심 스텁만 포함
- 실제 동작 로직: 미구현

## 먼저 읽을 문서

1. `docs/index.md`
2. `docs/_system/DOCS_SCHEMA.md`
3. `docs/registry/page-index.md`
4. `docs/operations/claude-code-session-workflow.md`
5. `.claude/README.md`

## 폴더 개요

- `apps/cli`: 엔트리포인트와 TUI 조립 레이어
- `packages/domain`: 엔티티 / 값 객체 / 도메인 서비스
- `packages/application`: 유스케이스 / 포트 / DTO
- `packages/infra`: 어댑터 / 저장소 / 텔레메트리 / 유틸
- `packages/shared`: 공통 상수 / 에러 / 포맷터
- `packages/config`: 설정 스키마와 설정 해석
- `docs`: 지속 관리형 프로젝트 위키
- `.claude`: Claude Code 작업용 컨텍스트 / 프롬프트 / 스킬 / handoff 자산

## 문서 시스템 운영 원칙

- `docs/`는 단순 산출물 묶음이 아니라 **계속 갱신되는 위키**다.
- 새 구현/결정/관찰이 생기면 관련 기준 문서와 `docs/log.md`를 갱신한다.
- 세션 후에는 `.claude/scratch/*` 뿐 아니라 필요 시 `docs/`도 함께 업데이트한다.
- `docs/index.md`는 콘텐츠 탐색용, `docs/registry/page-index.md`는 운영용 전체 목록, `docs/log.md`는 append-only 변경 기록이다.

## Claude Code 작업 루틴

이 스캐폴드는 저비용 요금제 환경에서 작업을 잘게 쪼개서 진행할 수 있도록 `.claude/skills/` 워크플로우를 포함한다.

추천 순서:

1. `/session-start`
2. `/resume-next`
3. `/scope-map`
4. `/slice-work`
5. 구현 스킬 1개 실행
6. `/manual-verify`
7. `/update-context`
8. `/handoff-report`

자세한 호출 흐름과 ASCII 다이어그램은 `docs/operations/claude-code-session-workflow.md`를 참고한다.
