---
name: dev-reopen
description: 일시 중단된 개발건을 재개하고 스프린트 계획을 수립한다
disable-model-invocation: true
---

# dev-reopen

이 스킬은 **`dev-pause`로 중단된 개발건을 이어서 진행**할 때 쓴다.
pause 파일의 컨텍스트를 활용하여 최소한의 읽기로 스프린트 계획을 수립한다.

**전제 조건:** `.claude/scratch/pause-{slug}.md` 파일이 존재해야 한다.
파일이 없으면 "pause 파일이 없습니다. `/dev-open {slug}`으로 시작해주세요."

## 입력

- `$ARGUMENTS` — 개발건 slug (**필수**)

## 먼저 읽을 것

- `.claude/scratch/pause-{slug}.md` (**필수** — 이어받기 컨텍스트)
- `.claude/scratch/dev-list.md` (현재 예상 스프린트 확인)
- `.claude/context/model-effort-guide.md`
- pause 파일의 컨텍스트가 가리키는 파일들

> dev-open과 달리 workflow.md, product-summary.md, architecture-summary.md는 읽지 않는다.
> pause 컨텍스트가 이미 필요한 정보를 담고 있다.

## 해야 할 일

1. `pause-{slug}.md`를 읽고 이어받기 컨텍스트를 확인한다.
2. dev-list.md에서 해당 slug의 남은 예상 스프린트를 확인한다.
3. 이번 세션에서 처리할 스프린트 목록을 확정한다.
4. 세션 stop line을 정한다.
5. `pause-{slug}.md`를 삭제한다.

## 출력 형식

- 재개 개발건: {slug}
- pause 컨텍스트 요약
- 이번 세션 스프린트 목록
- 세션 stop line
- `dev-sprint` 실행 순서
