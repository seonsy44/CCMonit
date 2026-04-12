# Product Summary

CCMonit은 Claude Code 하네스 환경에서 **현재 무엇이 실행 중인지**, **어떤 구조로 작업이 흘러가는지**, **토큰이 어디에 얼마나 쓰이고 있는지**를 실시간으로 보여주는 터미널 모니터링 도구다.

핵심 가치:
- 세션 / 팀 / 에이전트 / 태스크 / 스킬 / 툴 호출 가시화
- 파일 활동과 이벤트 로그의 구조화된 추적
- input / output / cache / total token 집계
- stuck, retry loop, token spike, adapter health 탐지
- 세션 종료 후 회고 가능한 로그와 리포트

실행 규칙:
- 한 세션에 목표는 1개만 둔다. 목표의 범위는 불확실성과 패턴 반복도에 따라 조절한다.
- 작업이 불분명하면 먼저 `kick-off`를 사용한다.
- 문서와 운영 규칙의 source of truth는 항상 `docs/`다.
- `.claude/`는 실행 보조 레이어이며, 기준을 새로 만들지 않는다.

세션 범위 판단 기준: `docs/operations/claude-code-session-workflow.md` §1-1

Source of truth:
- `docs/product/PRD.md`
- `docs/product/기능명세서.md`
- `docs/product/화면명세서.md`
- `docs/product/roadmap.md`
