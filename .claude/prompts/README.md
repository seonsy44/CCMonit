# .claude/prompts 운영 가이드

이 디렉토리는 **작업 절차를 저장하는 곳이 아니라, 사람이 Claude에게 작업을 시작시킬 때 쓰는 진입 템플릿**을 두는 곳이다.

실제 작업 절차는 아래 위치를 우선한다.

- `docs/operations/claude-code-session-workflow.md`
- `.claude/WORKFLOW.md`
- `.claude/skills/`
- `.claude/context/`
- `.claude/scratch/`

## 이 디렉토리에 남긴 파일

### 1. `kickoff.md`
새로운 작업 흐름을 시작할 때 쓰는 기본 진입 프롬프트다.

사용 시점:
- 프로젝트를 오랜만에 다시 열었을 때
- 새로운 모델 / 새로운 세션에서 시작할 때
- 어떤 skill부터 호출해야 할지 먼저 판단하게 만들고 싶을 때

### 2. `resume-session.md`
이전 세션의 상태를 이어받아 아주 작은 배치로 재개할 때 쓰는 프롬프트다.

사용 시점:
- 저비용 플랜으로 세션을 잘게 끊어 쓰는 경우
- `.claude/scratch/worklog.md` 와 `next-prompt.md`를 기반으로 바로 이어가고 싶을 때
- 같은 작업을 여러 번 나눠 진행할 때

### 3. `docs-maintenance.md`
문서 시스템을 갱신/정비하는 작업만 따로 할 때 쓰는 프롬프트다.

사용 시점:
- `docs/index.md`, `docs/log.md`, `docs/registry/*` 갱신
- 새 문서 ingest
- orphan page, broken link, source drift 점검
- wiki형 docs 시스템 lint

## 왜 다른 프롬프트는 제거했나

기존의 아래 성격의 프롬프트는 제거 대상으로 본다.

- `implement-adapter.md`
- `implement-tui.md`
- `review-checklist.md`
- 기타 “특정 모듈 구현 절차”를 직접 지시하는 프롬프트

이유:
1. 구현 절차는 `.claude/skills/`가 더 구조적으로 담당한다.
2. 같은 내용이 `docs/operations/claude-code-session-workflow.md` 와 중복되기 쉽다.
3. 프롬프트가 많아질수록 어떤 파일을 언제 써야 하는지 오히려 헷갈린다.

## 운영 원칙

1. **프롬프트는 얇게 유지한다.**
   - 설명 문서가 아니라 시작 템플릿이어야 한다.
   - 1회 호출용 문장 뼈대 역할만 한다.

2. **절차는 skills로 보낸다.**
   - 단계별 체크리스트
   - 파일 수정 순서
   - 결과 기록 규칙
   - 세션 종료 규칙

3. **지식은 context로 보낸다.**
   - 제품 요약
   - 아키텍처 요약
   - 문서 시스템 요약
   - 용어집

4. **상태는 scratch에 남긴다.**
   - 현재 작업 범위
   - 다음 세션 시작점
   - 미해결 질문
   - 임시 메모
