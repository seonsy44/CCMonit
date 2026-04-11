# .claude/prompts 운영 가이드

이 디렉토리는 **작업 절차를 저장하는 곳이 아니라, 사람이 Claude에게 작업을 시작시킬 때 쓰는 진입 템플릿**을 두는 곳이다.

실제 작업 절차는 아래 위치를 우선한다.
- `CLAUDE.md`
- `docs/operations/claude-code-session-workflow.md`
- `.claude/WORKFLOW.md`
- `.claude/skills/`
- `.claude/context/`
- `.claude/scratch/`

## 이 디렉토리에 남긴 파일

### 1. `kickoff.md`
새로운 작업 흐름을 시작할 때 쓰는 기본 진입 프롬프트다.

### 2. `resume-session.md`
이전 세션의 상태를 이어받아 작은 배치로 재개할 때 쓰는 프롬프트다.

### 3. `docs-maintenance.md`
문서 시스템을 갱신/정비하는 작업만 따로 할 때 쓰는 프롬프트다.

## 운영 원칙
1. 프롬프트는 얇게 유지한다.
2. 절차는 skills로 보낸다.
3. 지식은 context와 docs로 보낸다.
4. 상태는 scratch에 남긴다.
