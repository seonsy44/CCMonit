# resume session prompt

이전 세션의 상태를 이어받아 **작은 스프린트 1개만** 진행할 수 있게 정리해줘.

## 먼저 읽을 것
- `.claude/scratch/dev-list.md` (개발건 목록 확인)
- `.claude/scratch/notes.md`
- `.claude/scratch/devs/` 하위 디렉토리 목록 확인
- 가장 최근 활성 dev의 `devs/{slug}/next-prompt.md`, `worklog.md`, `open-questions.md`
- `CLAUDE.md`
- `docs/operations/claude-code-session-workflow.md`
- `.claude/context/product-summary.md`
- `.claude/context/architecture-summary.md`
- `.claude/context/docs-system-summary.md`
- 필요 시 관련 docs와 해당 skill

## 이번 세션 원칙
- 이전 세션의 남은 스프린트 중 가장 작은 단위 하나만 선택한다.
- 이미 끝난 일은 반복하지 않는다.
- 구현과 문서 반영 범위를 분리해서 본다.
- 세션 종료 시 `/dev-close`에 바로 들어갈 수 있게 정리한다.

## 원하는 출력
1. 현재 상태 요약
2. 이번 세션에서 할 스프린트 1개
3. 수정할 가능성이 높은 파일
4. 사용할 skill 순서
5. 세션 종료 시 남길 handoff 내용 초안
