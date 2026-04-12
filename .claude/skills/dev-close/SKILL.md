---
name: dev-close
description: 개발건을 마감한다. dev-list에서 제거하고 handoff를 정리한다
disable-model-invocation: true
---

# dev-close

이 스킬은 개발건 종료 단계에서 **docs 반영(docs-sync)**, **handoff 정리**, **dev-list 정리**를 한 번에 처리한다.

## scratch 경로 확인 (중요)

이번 세션에서 사용한 scratch 경로를 먼저 확인한다. `dev-open` 출력에서 명시됐어야 한다:

| 흐름 | scratch 경로 |
|------|-------------|
| named 개발건 | `.claude/scratch/devs/{slug}/` |

**notes.md는 항상 `.claude/scratch/notes.md`만 참조한다.**

## 먼저 읽을 것

결정된 scratch 경로에서:
- `{scratch경로}/worklog.md`
- `{scratch경로}/next-prompt.md`
- `{scratch경로}/open-questions.md`

공통:
- `.claude/scratch/notes.md`
- `.claude/scratch/dev-list.md` (있으면 — 완료된 개발건 제거용)
- 현재 세션에서 수정한 파일 목록
- 필요 시 `docs/log.md`

> docs-sync가 필요한 경우에만 추가로 읽는다:
> - `docs/operations/docs-operations.md`
> - 변경과 관련된 기준 문서

## 해야 할 일

### 1단계: docs-sync (필요 시만)

장기 규칙이나 구조가 바뀐 경우에만 수행한다:
1. 이번 세션에서 장기 반영이 필요한 변경을 식별한다.
2. 기준 문서를 먼저 갱신한다.
3. 필요 시 `docs/index.md`, `docs/registry/page-index.md`, `docs/log.md`를 보정한다.
4. 필요 시 `.claude/context/*` 요약을 갱신한다.

코드만 변경되고 규칙/구조는 그대로라면 이 단계를 건너뛴다.

### 2단계: handoff 정리

1. 이번 세션에서 끝낸 스프린트를 정리한다.
2. 아직 안 끝난 것을 정리한다.
3. 다음 세션 첫 스프린트를 1줄로 적는다.
4. 열린 질문을 정리한다.
5. **결정된 scratch 경로**의 `worklog.md`, `next-prompt.md`, `open-questions.md`에 반영할 내용을 제안한다.
   - `worklog.md`는 **최신 3~5개 스프린트를 유지**한다. 오래된 항목은 1줄 요약으로 축약한다.

### 3단계: dev-list 정리

`.claude/scratch/dev-list.md`가 있으면:
1. 이번 세션에서 완료한 개발건의 slug를 dev-list에서 찾는다.
2. 해당 행을 삭제한다.
3. 목록이 비면 "프로젝트 상태 요약"만 남기고 table은 비워둔다.

## 출력 형식

**현재 개발건 및 scratch 경로 명시** (예: `domain-services -> .claude/scratch/devs/domain-services/`)

**docs-sync (해당 시):**
- 반영한 기준 문서
- 갱신한 context 파일

**handoff:**
- 완료 항목
- 미완료 항목
- 다음 세션 첫 스프린트
- 열린 질문
- scratch 반영 초안 (경로 명시 포함)

**dev-list 정리 (해당 시):**
- dev-list에서 제거한 개발건: `{slug}`
