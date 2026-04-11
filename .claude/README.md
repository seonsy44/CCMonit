# .claude 운영 규칙

이 디렉토리는 Claude Code가 이 저장소를 **짧은 세션으로 안정적으로 이어서 작업**할 수 있도록 돕는 운영 레이어다.
코드나 제품의 source of truth 자체가 아니라, Claude가 source of truth를 **어디서 읽고 어떻게 이어받을지**를 정의하는 보조 시스템이다.

---

## 1. 목적

`.claude/`의 목적은 네 가지다.

1. **세션 시작 비용 절감**
   매번 긴 문서를 처음부터 다 읽지 않고, 필요한 요약과 실행 규칙만 먼저 읽게 한다.

2. **세션 간 handoff 안정화**
   저비용 플랜처럼 작업을 여러 번 끊어서 할 때도 다음 세션이 자연스럽게 이어받게 한다.

3. **작업 방식 표준화**
   범위 고정, stop line, docs 갱신, handoff 기록 같은 습관을 강제한다.

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
- 한 스킬은 한 가지 행동만 담당한다.
- 긴 구현보다 범위 고정, 분할, 검증, handoff 같은 운영 동작에 강하게 쓴다.
- 스킬은 `docs/`와 `.claude/`를 읽되, source of truth를 새로 만들지 않는다.

하위 디렉토리:
- 각 스킬 디렉토리: `SKILL.md`
- `_shared/`: 여러 스킬이 공통으로 읽는 실행 컨텍스트

---

### `.claude/skills/_shared/`

스킬 전용 **실행 컨텍스트**를 둔다.

이곳의 문서는 다음 질문에 답해야 한다.
- 스킬이 작업 전에 무엇을 먼저 읽어야 하는가?
- 지금 저장소에서 무엇이 가장 중요한 source of truth인가?
- 어떤 실수나 누락을 피해야 하는가?

넣어야 하는 것:
- 스킬 관점의 제품 요약
- 스킬 관점의 아키텍처 요약
- 문서 시스템 읽기 순서
- 스킬 관점의 핵심 용어

넣지 말아야 하는 것:
- 길고 서술적인 일반 소개
- 세션 handoff 정보
- 한 번 쓰고 버릴 임시 메모

원칙:
- 짧고 작업 지향적으로 쓴다.
- 일반 설명은 `.claude/context/`에 두고, 여기에는 실행 포인트만 남긴다.
- 이름은 `*-context.md`처럼 목적이 드러나게 짓는다.

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
5. 필요 시 `.claude/skills/_shared/*.md`
6. `.claude/scratch/*`

### 스킬 실행 전
1. 관련 `docs/*`
2. `.claude/context/*.md`
3. `.claude/skills/_shared/*.md`
4. `.claude/scratch/*`

핵심 원칙:
- 프로젝트의 사실과 기준은 `docs/`가 우선이다.
- `.claude/context/`는 빠른 진입용이다.
- `.claude/skills/_shared/`는 실행 가이드다.
- `.claude/scratch/`는 handoff 흔적이다.

---

## 4. 갱신 규칙

### `context`를 고쳐야 할 때
- 제품 목표/핵심 가치가 바뀌었을 때
- 아키텍처 경계가 달라졌을 때
- 문서 시스템 운영 원칙이 바뀌었을 때
- 팀 내 공용 용어가 달라졌을 때

### `skills/_shared`를 고쳐야 할 때
- 스킬들이 공통으로 읽는 우선순위가 바뀌었을 때
- source of truth 읽는 순서가 바뀌었을 때
- 자주 반복되는 스킬 실행 실수가 발견되었을 때
- 실행 전 점검 포인트를 더 짧고 강하게 고쳐야 할 때

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

### 세션 시작
- `README.md` 확인
- `CLAUDE.md` 확인
- `docs/operations/claude-code-session-workflow.md` 확인
- `.claude/context/` 확인
- `.claude/scratch/*` 확인
- 필요 시 `.claude/skills/_shared/` 확인
- 이번 세션 stop line 결정

### 세션 중
- 범위가 커지면 `scratch/notes.md`에 남긴다.
- 문서 영향이 생기면 즉시 `docs` 갱신 후보를 기록한다.
- 새 사실이 안정 정보인지 임시 정보인지 구분한다.

### 세션 종료
- `scratch/worklog.md` 갱신
- `scratch/next-prompt.md` 갱신
- `scratch/open-questions.md` 정리
- 필요 시 `context` 또는 `docs` 승격 반영
- 큰 세션이면 `handoff-report` 사용 여부를 결정한다.

---

## 6. 안티패턴

다음은 피한다.

1. `context`에 임시 TODO를 쌓아두기
2. `scratch`를 영구 문서처럼 방치하기
3. `docs`보다 `.claude`를 더 신뢰하게 만들기
4. 같은 정보를 `context`, `skills/_shared`, `docs`에 무분별하게 중복 복제하기
5. 스킬 전용 문서를 `context/`에 두어 이름만 비슷한 파일을 늘리기
6. `session-start` 전에 `resume-next`를 호출하는 식으로 시작/종료 의미를 섞기

---

## 7. 이 저장소에서의 고정 규칙

- `session-start`는 시작 단계에서 현재 문맥을 읽고 범위를 고정한다.
- `resume-next`는 종료 단계에서 다음 세션용 handoff를 남긴다.
- `handoff-report`는 큰 세션에서만 선택적으로 쓴다.
- workflow source of truth는 `docs/operations/claude-code-session-workflow.md`다.
- 루트 `CLAUDE.md`는 Claude Code용 진입 가이드이고, 루트 `README.md`는 사람용 진입 가이드다.
