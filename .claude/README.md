# .claude 운영 규칙

이 디렉토리는 Claude Code가 이 저장소를 **짧고 실용적인 세션으로 안정적으로 이어서 작업**할 수 있도록 돕는 운영 레이어다.
코드나 제품의 source of truth 자체가 아니라, Claude가 source of truth를 **어디서 읽고 어떻게 이어받을지**를 정의하는 보조 시스템이다.

---

## 1. 목적

`.claude/`의 목적은 네 가지다.

1. **세션 시작 비용 절감**  
   매번 긴 문서를 처음부터 다 읽지 않고, 필요한 요약과 실행 규칙만 먼저 읽게 한다.

2. **세션 간 handoff 안정화**  
   작업을 여러 번 끊어서 할 때도 다음 세션이 자연스럽게 이어받게 한다.

3. **작업 방식 단순화**  
   지나치게 세분화된 단계 대신, 시작 / 작업 / 문서 반영 / 마감의 간단한 흐름으로 운영한다.

4. **문서 시스템과 코드 작업 연결**  
   `docs/`가 단순 산출물 보관소가 아니라 유지보수 대상 위키라는 점을 Claude가 계속 인식하게 한다.

---

## 2. 디렉토리 역할

### `.claude/context/`

사람과 일반 Claude 세션이 공용으로 보는 **안정 요약본**을 둔다.

원칙:
- 프로젝트 전반에서 오래 유지되는 사실만 둔다.
- 세션 메모나 스킬 전용 실행 규칙은 두지 않는다.
- 상세 내용은 항상 `docs/`를 source of truth로 삼고, 여기서는 빠른 진입을 돕는 요약만 유지한다.

---

### `.claude/skills/`

Claude Code의 수동 스킬 정의를 둔다.

원칙:
- 스킬 수를 최소화한다.
- 한 스킬은 한 가지 역할만 맡되, 너무 잘게 쪼개지 않는다.
- 스킬은 `docs/`와 `.claude/`를 읽되, source of truth를 새로 만들지 않는다.

현재 사용 스킬:
- `kick-off`
- `session-start`
- `work`
- `docs-sync`
- `close-session`

각 스킬 디렉토리에 `SKILL.md`가 있다. 공용 실행 컨텍스트는 `.claude/context/`로 통합되어 있다.

---

### `.claude/prompts/`

사람이 Claude Code에게 작업을 시작시키기 위해 사용하는 **진입용 프롬프트 템플릿**을 둔다.

용도:
- 사람이 Claude에게 작업을 어떻게 시작하라고 말할지 빠르게 복사·수정해서 쓸 수 있는 템플릿을 제공한다.
- 세션 시작, 세션 재개, 문서 유지보수처럼 자주 반복되는 진입 문구를 표준화한다.

원칙:
- 작업 절차 자체는 두지 않고, 사람이 바로 붙여 넣어 쓸 수 있는 시작 문구만 둔다.
- 구현 흐름, 검증 규칙, 세션 운영 로직은 `skills/`와 `docs/operations/claude-code-session-workflow.md`에 두고 여기에는 중복 저장하지 않는다.
- 새 프롬프트를 추가할 때는 “이 파일이 호출 템플릿인가, 절차 문서인가”를 먼저 구분한다.

하위 파일:
- `kickoff.md`: 프로젝트 첫 진입 또는 새 작업 시작용
- `resume-session.md`: 중단된 세션 재개용
- `docs-maintenance.md`: 문서 점검·정리·인덱스 갱신 요청용

---

### `.claude/scratch/`

세션 간 handoff를 위한 **임시 작업 메모 공간**이다.

대표 용도:
- `worklog.md`: 이번까지 한 일
- `next-prompt.md`: 다음 세션 시작점
- `open-questions.md`: 아직 안 풀린 점
- `notes.md`: 작업 중 잠정 메모

원칙:
- 휘발성 정보는 여기 둔다.
- 여기 있는 내용이 반복 가치를 가지면 `context/`나 `docs/`로 승격한다.
- 반대로 오래된 scratch 내용은 주기적으로 비운다.

---

## 3. 읽기 우선순위

### 일반 세션 시작 시
1. `README.md`
2. `CLAUDE.md`
3. `docs/operations/claude-code-session-workflow.md`
4. `.claude/context/*.md`
5. `.claude/scratch/*`

### 스킬 실행 전
1. 관련 `docs/*`
2. `.claude/context/*.md` (session-start 이후라면 재읽기 불필요)
3. `.claude/scratch/*`

핵심 원칙:
- 프로젝트의 사실과 기준은 `docs/`가 우선이다.
- `.claude/context/`는 빠른 진입용이다.
- `.claude/scratch/`는 handoff 흔적이다.

---

## 4. 갱신 규칙

### `context`를 고쳐야 할 때
- 제품 목표/핵심 가치가 바뀌었을 때
- 아키텍처 경계가 달라졌을 때
- 문서 시스템 운영 원칙이 바뀌었을 때
- 팀 내 공용 용어가 달라졌을 때

### `scratch`를 고쳐야 할 때
- 거의 매 세션 종료 시
- 다음 세션으로 handoff가 필요할 때
- 범위가 바뀌거나 stop line이 바뀌었을 때

### `docs/`로 승격해야 할 때
- 세션 메모가 아니라 프로젝트 지식이 되었을 때
- 앞으로도 반복 참조할 가치가 있을 때
- 사람이 읽어도 의미 있는 산출물이 되었을 때

---

## 5. 추천 세션 루틴

### 새 작업이 불분명할 때
- `/kick-off`
- `/session-start [선택한 목표]`
- `/work [이번 배치]`
- 필요 시 `/docs-sync`
- `/close-session`

### 작업이 이미 분명할 때
- `/session-start [목표]`
- `/work [이번 배치]`
- 필요 시 `/docs-sync`
- `/close-session`

### 세션 종료 시
- `scratch/worklog.md` 갱신
- `scratch/next-prompt.md` 갱신
- `scratch/open-questions.md` 정리
- 필요 시 `context` 또는 `docs` 승격 반영

---

## 6. 안티패턴

다음은 피한다.

1. `context`에 임시 TODO를 쌓아두기
2. `scratch`를 영구 문서처럼 방치하기
3. `docs`보다 `.claude`를 더 신뢰하게 만들기
4. 같은 정보를 `context`와 `docs`에 무분별하게 중복 복제하기
5. 스킬 전용 문서를 `context/`에 두어 이름만 비슷한 파일을 늘리기
6. 사소한 작업마다 너무 많은 스킬을 순서대로 강제해서 운영 오버헤드를 키우기

---

## 7. 이 저장소에서의 고정 규칙

- `kick-off`는 작업 후보를 제안하는 PM 역할이다.
- `session-start`는 시작 단계에서 현재 문맥을 읽고 목표와 stop line을 정리한다.
- `work`는 이번 배치의 실제 작업을 수행하는 메인 스킬이다.
- `docs-sync`는 문서 반영이 필요할 때만 쓴다.
- `close-session`은 종료 단계에서 다음 세션용 handoff를 남긴다.
- workflow source of truth는 `docs/operations/claude-code-session-workflow.md`다.
- 루트 `CLAUDE.md`는 Claude Code용 진입 가이드이고, 루트 `README.md`는 사람용 진입 가이드다.
