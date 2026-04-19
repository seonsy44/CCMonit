# CLAUDE.md

## 규칙

- source of truth는 `docs/`. `.claude/`는 보조 레이어다.
- 채팅 설명보다 문서와 파일 상태를 우선 신뢰한다.
- 범위를 먼저 고정하고, 그 다음에 구현한다.
- `.claude/` 내부에 source of truth를 새로 만들지 않는다.

## docs 관리

`docs/`는 LLM이 유지·관리하는 프로젝트 wiki다. 인간은 방향을 설정하고, LLM은 문서의 작성·갱신·정리를 담당한다.

- 명세를 추가하거나 수정할 때는 반드시 `docs/conventions.md`의 운영 규약을 따른다.
- `docs/index.md`는 전체 문서의 카탈로그다. 페이지를 추가·삭제하면 반드시 index를 갱신한다.
- `docs/log.md`는 변경 이력이다. 문서를 변경하면 반드시 log에 기록한다.
- 파일을 잘게 분리하여 AI가 필요한 문서만 읽을 수 있도록 한다.
