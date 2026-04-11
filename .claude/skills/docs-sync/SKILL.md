---
name: docs-sync
description: 세션 결과를 docs, context, registry, log에 반영한다
disable-model-invocation: true
---

# docs-sync

이 스킬은 **문서와 장기 규칙 반영**이 필요할 때만 쓴다.

## 입력
- `$ARGUMENTS`에는 반영할 주제를 짧게 준다.
- 예: `workflow update`, `README and CLAUDE alignment`, `domain docs reflect`

## 먼저 읽을 것
- `docs/operations/claude-code-session-workflow.md`
- `docs/operations/docs-operations.md`
- 관련 기준 문서
- `docs/index.md`
- `docs/registry/page-index.md`
- `docs/log.md`

> 참고: `.claude/context/*.md`와 `.claude/scratch/*`는 session-start/work에서 이미 로드됨. 독립 실행 시에만 context/*.md를 읽는다.

## 해야 할 일
1. 이번 세션에서 장기 반영이 필요한 변경을 식별한다.
2. 기준 문서를 먼저 갱신한다.
3. 필요 시 `docs/index.md`, `docs/registry/page-index.md`, `docs/log.md`를 보정한다.
4. 필요 시 `.claude/context/*` 요약도 갱신한다.
5. 임시 메모와 장기 지식을 섞지 않는다.

## 출력 형식
- 반영한 기준 문서
- 보정한 운영 문서
- 갱신한 context 파일
- 추가로 남은 docs 작업
