# CCMonit

CCMonit은 Claude Code 하네스 환경에서 **지금 어떤 작업이 진행 중인지**와 **토큰/도구 사용 흐름이 어떻게 누적되는지**를 터미널에서 관찰하기 위한 모니터링 도구 스캐폴드다.

## 목적
- 세션 / 에이전트 / 태스크 / 스킬 / 툴 호출의 현재 상태를 한눈에 파악
- 작업 단위 로그와 리플레이 가능한 이벤트 저장
- input / output / cache read / cache write / total token 추적
- stuck, retry loop, token spike, adapter health 같은 운영 이슈 감지
- 저비용 Claude Code 세션에서도 작업을 잘게 쪼개어 이어갈 수 있는 운영 구조 제공

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
1. `/session-start [목표]`
2. `/token-budget-plan [optional]`
3. `/scope-map [범위]`
4. `/slice-work [작업 단위]`
5. 구현 스킬 1개 또는 docs 스킬 1개
6. `/manual-verify [배치명]`
7. `/update-context [optional]`
8. `/resume-next`
9. `/handoff-report [optional]`

핵심 규칙:
- `session-start`가 이전 scratch와 docs를 읽어 현재 상태를 맞춘다.
- `resume-next`는 세션 **끝에서** 다음 세션용 handoff를 남길 때 쓴다.
- `handoff-report`는 큰 세션에서만 선택적으로 쓴다.

## 제외 사항
사용자 요청에 따라 테스트 폴더와 테스트 라이브러리는 이번 스캐폴드에서 제외했다.
