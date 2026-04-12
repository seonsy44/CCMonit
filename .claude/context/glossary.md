# Glossary

도메인 용어:

- Session: 모니터링 대상 Claude Code 실행 단위
- Team: agent 묶음 또는 상위 orchestration 단위
- Agent: 실제 작업을 수행하는 주체
- Task: agent 가 수행하는 작업 단위
- Skill: task 안에서 호출된 능력/행동 단위
- Tool Call: Bash, Read, Write 같은 구체 도구 호출
- Canonical Event: CCMonit 내부 표준 이벤트
- Accuracy: exact / derived / estimated / unavailable
- Read Model: TUI 나 report 가 바로 소비할 수 있는 요약 모델
- Docs Steward: `docs/`의 index / registry / log / knowledge 건강을 유지하는 역할

세션 운영 용어:

- batch: 한 세션에서 한 번에 처리하는 작은 구현 단위
- stop line: 이번 세션에서 여기까지만 하고 멈춘다는 경계
- adapter health: 로그 감지기 / 파서 / 토큰 추출기의 신뢰도와 정상 상태
- docs ingest: 새 사실을 위키 문서에 편입하는 작업
- docs lint: 위키의 누락 / 충돌 / 고아 문서를 점검하는 작업

세부 용어집 source of truth:

- `docs/registry/glossary.md`
