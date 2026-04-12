---
id: ARCH-EVENT-FLOW
title: 'CCMonit 이벤트 모델 명세서'
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, events]
links:
  - ../knowledge/concepts/canonical-event.md
  - ../knowledge/concepts/read-model.md
---

# CCMonit 이벤트 모델 명세서

## 1. 문서 목적

본 문서는 **CCMonit(Claude Code Monitor)** 의 내부 이벤트 모델을 정의한다.
이벤트 모델의 목적은 다음과 같다.

- Claude Code / harness / adapter / filesystem 으로부터 들어오는 다양한 신호를 **공통된 이벤트 체계** 로 정규화한다.
- 실시간 TUI, 로그 저장, 토큰 집계, 알림 탐지, 세션 회고 리포트가 **동일한 이벤트 흐름** 위에서 동작하도록 만든다.
- 초기에 로그 테일 기반으로 시작하더라도, 이후 runtime integration, harness adapter, git adapter, remote collector 등을 붙여도 **도메인 모델과 화면 구조가 흔들리지 않도록** 한다.
- replay, test fixture, anomaly detection, session comparison 같은 기능을 나중에 추가하기 쉬운 기반을 마련한다.

이 문서에서 정의하는 이벤트는 **UI 이벤트가 아니라, 시스템 내부 표준 도메인 이벤트** 이다.
즉, 외부 입력을 그대로 화면에 붙이는 것이 아니라, 먼저 본 문서의 이벤트로 변환한 뒤 저장/집계/표시해야 한다.

---

## 2. 설계 원칙

### 2.1 외부 입력과 내부 이벤트를 분리한다

Claude Code 로그 포맷, harness 출력 포맷, 파일 시스템 이벤트 포맷은 언제든 바뀔 수 있다.
따라서 외부 raw 데이터를 그대로 내부 표준으로 간주하지 않는다.

- 외부 raw 입력: adapter별 원본 메시지
- 내부 canonical event: CCMonit 표준 이벤트
- 읽기 모델(read model): TUI와 리포트에서 사용하는 집계 결과

### 2.2 상태보다 이벤트를 우선 저장한다

현재 상태는 언제든 다시 계산할 수 있어야 한다.
따라서 저장의 기준은 상태 스냅샷이 아니라 이벤트 스트림이다.

- 이벤트는 append-only 로 저장한다.
- 현재 화면용 상태는 projector/reducer 로 계산한다.
- 세션 중간 복구도 이벤트 재생(replay)을 기본으로 한다.

### 2.3 불완전성을 모델에 포함한다

Claude Code 환경에서는 모든 관계를 100% 확정하기 어렵다.
특히 아래 항목은 불확실할 수 있다.

- task ↔ skill 매핑
- skill ↔ tool 호출 매핑
- agent/team 계층
- 토큰 input/output/cache 분해값
- 파일 변경과 작업의 직접 연결

따라서 이벤트와 집계 모델에 아래 개념을 포함한다.

- `accuracy`: exact / derived / estimated / unavailable
- `confidence_score`: 0~1 실수
- `source`: 어떤 adapter와 어떤 규칙으로 생성되었는지
- `evidence`: 원문 또는 매핑 근거

### 2.4 이벤트는 작게 나누되, 과도하게 세분화하지 않는다

너무 거친 이벤트는 후처리가 어렵고, 너무 잘게 쪼개면 구현 복잡도와 저장 비용이 커진다.
초기 MVP에서는 다음 기준을 따른다.

- 의미 있는 상태 전환은 별도 이벤트로 둔다.
- 단순 화면 갱신용 파생 계산은 이벤트로 저장하지 않는다.
- 고빈도 값은 delta가 아닌 summary update 이벤트로 저장할 수 있다.

### 2.5 UI는 이벤트를 직접 해석하지 않는다

TUI 패널은 raw event를 직접 읽지 않고, projector가 계산한 read model을 사용한다.
이렇게 해야 화면 코드가 로그 포맷에 종속되지 않는다.

---

## 3. 이벤트 흐름 개요

```text
[Claude logs / harness output / file watcher / other adapters]
                    ↓
             Adapter Parser Layer
                    ↓
         Canonical Event Normalizer
                    ↓
         Event Bus + Event Store(JSONL)
             ↓             ↓         ↓
         Projector      Alerting   Reporter
             ↓
          Read Models
             ↓
             TUI
```

핵심 포인트는 다음과 같다.

- **Adapter** 는 raw 입력을 읽는다.
- **Normalizer** 는 raw 입력을 canonical event 로 변환한다.
- **Event Store** 는 canonical event 를 append-only 로 저장한다.
- **Projector** 는 이벤트를 읽어 현재 상태를 만든다.
- **Alerting** 은 이벤트 흐름에서 이상 징후를 탐지한다.
- **Reporter** 는 세션 종료 후 이벤트와 상태를 바탕으로 리포트를 생성한다.

---

## 4. 이벤트 계층

CCMonit의 핵심 추적 계층은 다음과 같다.

```text
Session
 ├─ Team (optional)
 │   └─ Agent
 │       └─ Task
 │           └─ Skill Invocation
 │               └─ Tool Call
 └─ File Activity / Alert / Token Summary / Adapter Health
```

다만 실제 로그에서는 이 계층이 완전히 보장되지 않는다.
따라서 다음 두 개념을 함께 둔다.

### 4.1 structural parent

명시적으로 확인된 상위 관계.

예:

- task가 특정 agent에 속함이 로그로 확인됨
- tool call 이 특정 skill invocation 내부에서 발생함이 명확함

### 4.2 inferred parent

정황상 추론된 상위 관계.

예:

- 동일 시간대/동일 prefix/동일 stream 으로 인해 task와 tool을 연결
- 파일 수정 시점 직전 실행 중이던 task에 연결

inferred parent 는 반드시 아래 메타를 함께 가진다.

- `relation_accuracy`
- `relation_confidence_score`
- `relation_reason`

확정할 수 없는 이벤트는 `orphan` 버킷으로 남긴다.

---

## 5. Canonical Event Envelope

### 5.1 MVP Envelope (현재 구현 대상)

모든 canonical event 는 아래 공통 envelope 를 가진다.

```ts
interface CanonicalEvent<TPayload = unknown> {
  event_id: string; // UUID — 이벤트 고유 ID
  event_kind: EventKind; // 예: 'task.started', 'tool.finished'
  session_id: string; // 소속 세션
  occurred_at: string; // ISO 8601 — 실제 발생 시각
  entity_type: EntityType; // 이벤트 대상 개체 종류
  entity_id: string; // 이벤트 대상 개체 ID
  parent_id?: string; // 직접 부모 개체 ID (계층 구조용)
  accuracy?: AccuracyStatus; // 신뢰도 (token 관련 이벤트에서 주로 사용)
  confidence_score?: number; // 0.0~1.0 (추론 기반 매핑 시)
  payload: TPayload; // 이벤트별 상세 데이터
}
```

#### 필드 정의

- **`event_id`** — UUID v7 또는 timestamp sortable id. 중복 삽입 방지 키.
- **`event_kind`** — `도메인.동사` 형식. EventKind 타입 참조.
- **`session_id`** — 이벤트가 속한 세션 식별자.
- **`occurred_at`** — raw log timestamp 우선 사용. 없으면 관측 시각 대체하되 accuracy 를 낮춘다.
- **`entity_type`** — 이벤트 대상의 종류: `session | agent | task | skill | tool | file | alert | adapter`.
- **`entity_id`** — 이벤트 대상의 고유 ID.
- **`parent_id`** — 직접 부모 개체 ID. 예: skill 이벤트의 parent 는 task ID.
- **`accuracy`** — `exact | derived | estimated | unavailable`. 주로 token 관련 이벤트에서 사용.
- **`confidence_score`** — 0.0~1.0. 추론 규칙 기반 매핑 시 사용.
- **`payload`** — 이벤트 종류별 상세 데이터.

### 5.2 V1 확장 필드 (향후 추가 예정)

아래 필드는 MVP 이후 필요에 따라 envelope 에 추가한다.

| 필드               | 목적                                    | 추가 시점                  |
| ------------------ | --------------------------------------- | -------------------------- |
| `event_version`    | payload schema 버전 관리                | payload 구조 변경 시       |
| `observed_at`      | adapter 관측 시각 (occurred_at 과 분리) | 멀티 어댑터 지원 시        |
| `correlation_id`   | 같은 흐름의 이벤트 묶음                 | 복잡한 tool call 추적 시   |
| `causation_id`     | 직접 원인 이벤트 ID                     | 인과관계 분석 시           |
| `trace_id`         | 세션 내 장기 흐름 추적                  | 고급 디버깅 시             |
| `actor` / `target` | 발생 주체와 대상 분리                   | 멀티 에이전트 고급 분석 시 |
| `related_refs`     | 부모-자식이 아닌 관계 참조              | 파일-태스크 연관 분석 시   |
| `source`           | adapter/parser 메타데이터               | 어댑터 품질 검증 시        |
| `tags`             | 자유 태그                               | 커스텀 필터링 시           |
| `raw_ref`          | 원본 로그 위치 참조                     | replay/디버깅 고급 기능 시 |

---

## 6. 공통 보조 타입

### 6.1 AccuracyStatus

```ts
type AccuracyStatus = 'exact' | 'derived' | 'estimated' | 'unavailable';
```

- `exact`: 원문에서 직접 확인됨
- `derived`: 여러 exact 이벤트를 조합해 계산됨
- `estimated`: 휴리스틱/추정 모델 결과
- `unavailable`: 값을 구할 수 없음

### 6.2 EntityType

```ts
type EntityType = 'session' | 'agent' | 'task' | 'skill' | 'tool' | 'file' | 'alert' | 'adapter';
```

### 6.3 V1 보조 타입 (향후 추가 예정)

아래 타입들은 V1 확장 필드 도입 시 함께 정의한다.

- **EventEntityRef** — entity_type, entity_id, label, relation_accuracy 등
- **EventSourceMeta** — adapter_kind, parser_version, host, pid 등
- **RawReference** — raw_store, pointer, preview 등

---

## 7. 이벤트 이름 규칙

이벤트 이름은 아래 규칙을 따른다.

### 7.1 기본 형식

```text
<aggregate>.<verb>
```

예:

- `session.started`
- `agent.spawned`
- `task.finished`
- `tool.called`
- `alert.raised`

### 7.2 동사 선택 기준

- `started`: 실행 시작
- `updated`: 중간 갱신
- `finished`: 정상 종료
- `failed`: 실패 종료
- `cancelled`: 중단 종료
- `detected`: 수동/외부 관측 결과
- `resolved`: 문제 해소
- `linked`: 관계 연결 확정
- `orphaned`: 관계를 못 찾음
- `snapshot`: 요약 정보 갱신

### 7.3 화면 전용 이름 금지

예를 들어 `panel.refreshed`, `table.sorted` 같은 UI 이벤트는 본 canonical event 모델 범위에 넣지 않는다.
UI 내부 상태는 별도 presentation 레이어에서 처리한다.

---

## 8. 도메인별 이벤트 정의

아래 이벤트 목록은 **MVP 필수**, **권장**, **후순위** 를 섞어 정리한 것이다.
실구현에서는 우선순위를 두고 순차 도입하면 된다.

---

## 9. Session 이벤트

### 9.1 `session.detected`

세션 후보를 외부 입력에서 처음 발견했을 때.

```ts
interface SessionDetectedPayload {
  session_id_hint?: string;
  cwd?: string;
  model?: string;
  provider?: string;
  cli_version?: string;
}
```

### 9.2 `session.started`

세션 시작이 확정되었을 때.

```ts
interface SessionStartedPayload {
  session_id: string;
  cwd: string;
  model?: string;
  provider?: string;
  started_at_accuracy: AccuracyStatus;
}
```

### 9.3 `session.updated`

세션 메타가 갱신되었을 때.

```ts
interface SessionUpdatedPayload {
  cwd?: string;
  model?: string;
  active_agent_count?: number;
  active_task_count?: number;
  note?: string;
}
```

### 9.4 `session.idle_started`

일정 시간 이상 새 활동이 없다고 판단되었을 때.

```ts
interface SessionIdleStartedPayload {
  idle_threshold_ms: number;
  last_activity_at: string;
}
```

### 9.5 `session.idle_ended`

idle 상태에서 다시 활동이 발생했을 때.

```ts
interface SessionIdleEndedPayload {
  idle_duration_ms: number;
}
```

### 9.6 `session.finished`

세션 종료가 확정되었을 때.

```ts
interface SessionFinishedPayload {
  end_reason: 'normal' | 'interrupted' | 'crash' | 'unknown';
  exit_code?: number;
  duration_ms?: number;
}
```

---

## 10. Adapter 이벤트

### 10.1 `adapter.started`

특정 adapter가 기동됨.

```ts
interface AdapterStartedPayload {
  adapter_id: string;
  adapter_kind: string;
  watch_target?: string;
}
```

### 10.2 `adapter.health_changed`

adapter health 상태 변화.

```ts
interface AdapterHealthChangedPayload {
  adapter_id: string;
  prev_status?: 'healthy' | 'degraded' | 'disconnected';
  next_status: 'healthy' | 'degraded' | 'disconnected';
  reason?: string;
}
```

### 10.3 `adapter.parse_failed`

raw 입력을 canonical event 로 바꾸지 못했을 때.

```ts
interface AdapterParseFailedPayload {
  adapter_id: string;
  parser_stage: 'detect' | 'normalize' | 'map';
  reason: string;
  severity: 'info' | 'warn' | 'error';
}
```

### 10.4 `adapter.stopped`

adapter 종료.

```ts
interface AdapterStoppedPayload {
  adapter_id: string;
  stop_reason: 'normal' | 'error' | 'user' | 'system';
}
```

---

## 11. Team 이벤트

### 11.1 `team.detected`

team이 관측됨.

```ts
interface TeamDetectedPayload {
  team_id: string;
  team_name?: string;
  role?: string;
}
```

### 11.2 `team.updated`

team 메타 갱신.

```ts
interface TeamUpdatedPayload {
  team_name?: string;
  member_count?: number;
  active_task_count?: number;
}
```

### 11.3 `team.finished`

team 단위 작업 종료.

```ts
interface TeamFinishedPayload {
  summary?: string;
  status: 'completed' | 'failed' | 'cancelled';
}
```

---

## 12. Agent 이벤트

### 12.1 `agent.detected`

agent 후보 발견.

```ts
interface AgentDetectedPayload {
  agent_id: string;
  role_name?: string;
  team_id?: string;
  parent_agent_id?: string;
}
```

### 12.2 `agent.spawned`

agent 시작 확정.

```ts
interface AgentSpawnedPayload {
  agent_id: string;
  role_name?: string;
  started_by?: 'session' | 'team' | 'agent' | 'system';
}
```

### 12.3 `agent.status_changed`

agent 상태 변화.

```ts
interface AgentStatusChangedPayload {
  prev_status?: 'running' | 'waiting' | 'idle' | 'completed' | 'failed';
  next_status: 'running' | 'waiting' | 'idle' | 'completed' | 'failed';
  reason?: string;
}
```

### 12.4 `agent.summary_updated`

agent 단위 집계 갱신.

```ts
interface AgentSummaryUpdatedPayload {
  active_task_count?: number;
  completed_task_count?: number;
  tool_call_count?: number;
  last_activity_at?: string;
}
```

### 12.5 `agent.finished`

agent 종료.

```ts
interface AgentFinishedPayload {
  result_status: 'completed' | 'failed' | 'cancelled';
  summary?: string;
}
```

---

## 13. Task 이벤트

### 13.1 `task.detected`

작업 후보 발견.

```ts
interface TaskDetectedPayload {
  task_id: string;
  title?: string;
  category?: string;
}
```

### 13.2 `task.started`

작업 시작.

```ts
interface TaskStartedPayload {
  task_id: string;
  title: string;
  category?: string;
  started_at_accuracy: AccuracyStatus;
}
```

### 13.3 `task.updated`

작업 메타 또는 진행 상황 갱신.

```ts
interface TaskUpdatedPayload {
  title?: string;
  progress_text?: string;
  status_hint?: 'running' | 'waiting' | 'blocked' | 'retrying';
  note?: string;
}
```

### 13.4 `task.status_changed`

상태가 명시적으로 바뀜.

```ts
interface TaskStatusChangedPayload {
  prev_status?:
    | 'queued'
    | 'running'
    | 'waiting'
    | 'blocked'
    | 'retrying'
    | 'completed'
    | 'failed'
    | 'cancelled';
  next_status:
    | 'queued'
    | 'running'
    | 'waiting'
    | 'blocked'
    | 'retrying'
    | 'completed'
    | 'failed'
    | 'cancelled';
  reason?: string;
}
```

### 13.5 `task.retry_scheduled`

재시도 예정.

```ts
interface TaskRetryScheduledPayload {
  retry_count: number;
  reason?: string;
  next_retry_at?: string;
}
```

### 13.6 `task.stderr_detected`

stderr 발생.

```ts
interface TaskStderrDetectedPayload {
  severity: 'info' | 'warn' | 'error';
  message_preview?: string;
}
```

### 13.7 `task.summary_updated`

작업 요약 또는 결과가 업데이트됨.

```ts
interface TaskSummaryUpdatedPayload {
  summary_text?: string;
  result_preview?: string;
}
```

### 13.8 `task.stuck_detected`

장시간 진전 없음으로 판단.

```ts
interface TaskStuckDetectedPayload {
  idle_duration_ms: number;
  threshold_ms: number;
  reason?: string;
}
```

### 13.9 `task.finished`

정상 종료.

```ts
interface TaskFinishedPayload {
  result_status: 'completed';
  summary?: string;
  duration_ms?: number;
}
```

### 13.10 `task.failed`

실패 종료.

```ts
interface TaskFailedPayload {
  result_status: 'failed';
  error_message?: string;
  duration_ms?: number;
}
```

### 13.11 `task.cancelled`

취소 종료.

```ts
interface TaskCancelledPayload {
  result_status: 'cancelled';
  reason?: string;
}
```

---

## 14. Skill Invocation 이벤트

### 14.1 `skill.detected`

스킬 호출 후보 발견.

```ts
interface SkillDetectedPayload {
  skill_invocation_id: string;
  skill_name?: string;
  skill_path?: string;
}
```

### 14.2 `skill.started`

스킬 시작.

```ts
interface SkillStartedPayload {
  skill_invocation_id: string;
  skill_name: string;
  skill_path?: string;
}
```

### 14.3 `skill.updated`

스킬 메타/상태 갱신.

```ts
interface SkillUpdatedPayload {
  status_hint?: 'running' | 'waiting' | 'completed' | 'failed';
  note?: string;
}
```

### 14.4 `skill.finished`

스킬 종료.

```ts
interface SkillFinishedPayload {
  result_status: 'completed' | 'failed' | 'cancelled';
  duration_ms?: number;
}
```

---

## 15. Tool Call 이벤트

툴 호출은 토큰 전략과 작업 회고에 핵심이므로 비교적 자세히 남긴다.

### 15.1 `tool.detected`

툴 호출 후보 발견.

```ts
interface ToolDetectedPayload {
  tool_call_id: string;
  tool_name?: string;
}
```

### 15.2 `tool.called`

툴 호출 시작.

```ts
interface ToolCalledPayload {
  tool_call_id: string;
  tool_name: string;
  args_preview?: string;
  input_size_bytes?: number;
  input_token_usage?: TokenUsageSnapshot;
  capture_policy: 'none' | 'preview' | 'full' | 'masked';
}
```

### 15.3 `tool.stdout_detected`

툴 stdout 감지.

```ts
interface ToolStdoutDetectedPayload {
  tool_call_id: string;
  chunk_preview?: string;
  chunk_size_bytes?: number;
}
```

### 15.4 `tool.stderr_detected`

툴 stderr 감지.

```ts
interface ToolStderrDetectedPayload {
  tool_call_id: string;
  severity: 'info' | 'warn' | 'error';
  chunk_preview?: string;
}
```

### 15.5 `tool.finished`

툴 정상/비정상 종료.

```ts
interface ToolFinishedPayload {
  tool_call_id: string;
  tool_name: string;
  exit_status: 'success' | 'error' | 'timeout' | 'cancelled' | 'unknown';
  duration_ms?: number;
  output_size_bytes?: number;
  output_token_usage?: TokenUsageSnapshot;
}
```

### 15.6 `tool.relation_inferred`

툴과 상위 skill/task 관계를 추론해서 연결함.

```ts
interface ToolRelationInferredPayload {
  tool_call_id: string;
  inferred_parent_type: 'skill_invocation' | 'task' | 'agent';
  inferred_parent_id: string;
  reason: string;
}
```

### 15.7 `tool.summary_updated`

툴 호출 결과 요약 갱신.

```ts
interface ToolSummaryUpdatedPayload {
  tool_call_id: string;
  summary_text?: string;
  file_outputs?: string[];
}
```

---

## 16. File Activity 이벤트

### 16.1 `file.detected`

관심 대상 파일이 처음 감지됨.

```ts
interface FileDetectedPayload {
  path: string;
  kind_hint?: 'source' | 'config' | 'log' | 'artifact' | 'unknown';
}
```

### 16.2 `file.changed`

파일 수정.

```ts
interface FileChangedPayload {
  path: string;
  change_type: 'created' | 'modified' | 'deleted' | 'renamed';
  previous_path?: string;
  size_bytes?: number;
  extension?: string;
}
```

### 16.3 `file.linked`

파일 변경과 task/agent/tool 관계가 연결됨.

```ts
interface FileLinkedPayload {
  path: string;
  linked_entity_type: 'task' | 'agent' | 'tool_call';
  linked_entity_id: string;
  reason: string;
}
```

### 16.4 `file.burst_detected`

짧은 시간에 동일 파일 반복 갱신.

```ts
interface FileBurstDetectedPayload {
  path: string;
  event_count: number;
  window_ms: number;
}
```

---

## 17. Token 이벤트

토큰은 정확도가 중요하므로 별도 카테고리로 유지한다.

### 17.1 공통 토큰 스냅샷 타입

```ts
interface TokenUsageSnapshot {
  input?: MeasuredValue;
  output?: MeasuredValue;
  cache_read?: MeasuredValue;
  cache_write?: MeasuredValue;
  total?: MeasuredValue;
  estimated_cost_usd?: MeasuredValue;
}

interface MeasuredValue {
  value?: number;
  accuracy: AccuracyStatus;
  confidence_score?: number;
  source_detail?: string;
}
```

### 17.2 `token.updated`

특정 개체에 대한 토큰 정보가 갱신됨.

```ts
interface TokenUpdatedPayload {
  scope_type: 'session' | 'agent' | 'task' | 'skill_invocation' | 'tool_call';
  scope_id: string;
  token_usage: TokenUsageSnapshot;
  delta_from_previous?: Partial<
    Record<'input' | 'output' | 'cache_read' | 'cache_write' | 'total', number>
  >;
}
```

### 17.3 `token.budget_threshold_reached`

예산/임계치 도달.

```ts
interface TokenBudgetThresholdReachedPayload {
  scope_type: 'session' | 'agent' | 'task';
  scope_id: string;
  metric: 'total_tokens' | 'estimated_cost_usd';
  threshold_value: number;
  current_value: number;
}
```

### 17.4 `token.anomaly_detected`

급격한 증가나 예상 대비 이상치.

```ts
interface TokenAnomalyDetectedPayload {
  scope_type: 'session' | 'agent' | 'task' | 'tool_call';
  scope_id: string;
  anomaly_kind: 'spike' | 'distribution_gap' | 'missing_breakdown';
  description: string;
}
```

---

## 18. Alert 이벤트

### 18.1 `alert.raised`

알림 생성.

```ts
interface AlertRaisedPayload {
  alert_id: string;
  alert_type:
    | 'task_stuck'
    | 'stderr_burst'
    | 'token_spike'
    | 'retry_loop'
    | 'adapter_disconnected'
    | 'orphan_growth'
    | 'parse_failure_burst'
    | 'session_idle_long';
  severity: 'info' | 'warn' | 'error';
  title: string;
  message: string;
}
```

### 18.2 `alert.acknowledged`

사용자 또는 시스템이 확인 처리.

```ts
interface AlertAcknowledgedPayload {
  alert_id: string;
  acknowledged_by: 'user' | 'system';
}
```

### 18.3 `alert.resolved`

알림 해소.

```ts
interface AlertResolvedPayload {
  alert_id: string;
  resolved_reason?: string;
}
```

### 18.4 `alert.suppressed`

알림 무시/침묵 처리.

```ts
interface AlertSuppressedPayload {
  alert_id: string;
  suppressed_until?: string;
  reason?: string;
}
```

---

## 19. User/System/Report 이벤트

### 19.1 `user.question_detected`

AskUserQuestion 같은 상호작용이 감지됨.

```ts
interface UserQuestionDetectedPayload {
  question_preview?: string;
  blocking: boolean;
}
```

### 19.2 `system.note_detected`

Claude Code 또는 harness가 남긴 시스템 노트.

```ts
interface SystemNoteDetectedPayload {
  note_kind?: 'info' | 'warning' | 'checkpoint';
  text_preview?: string;
}
```

### 19.3 `report.generated`

세션 리포트 생성 완료.

```ts
interface ReportGeneratedPayload {
  report_id: string;
  report_kind: 'session-summary' | 'task-summary' | 'token-analysis';
  format: 'md' | 'json' | 'csv';
  output_path: string;
}
```

---

## 20. 상태 전이 규칙

이벤트는 상태를 바꾸는 근거가 되므로, 각 aggregate 별로 허용되는 전이 규칙을 정의한다.

### 20.1 Session 상태

```text
detected → running → idle → running → finished
                      └──────────────→ finished
```

허용 상태:

- detected
- running
- idle
- finished

### 20.2 Agent 상태

```text
detected → running ↔ waiting ↔ idle → completed
                                 └→ failed
```

### 20.3 Task 상태

```text
detected → queued → running ↔ waiting ↔ blocked ↔ retrying
                                      ├→ completed
                                      ├→ failed
                                      └→ cancelled
```

### 20.4 Skill 상태

```text
detected → running → completed
                   ├→ failed
                   └→ cancelled
```

### 20.5 Tool 상태

```text
detected → called → success
                  ├→ error
                  ├→ timeout
                  └→ cancelled
```

구현 시 projector는 **이벤트 순서가 꼬이거나 누락될 수 있음** 을 전제로 해야 한다.
예:

- `task.finished` 가 먼저 들어오고 `task.started` 가 늦게 들어오는 경우
- `tool.finished` 는 있으나 `tool.called` 가 없는 경우

이 경우 projector는 아래 원칙을 따른다.

- 없는 시작 이벤트는 synthetic start 로 보정 가능
- 보정 사실은 state에 표시
- 원본 이벤트는 변경하지 않음

---

## 21. 상관관계(correlation) 규칙

### 21.1 correlation_id 사용 기준

동일한 작업 단위를 묶을 때 사용한다.

예:

- 하나의 tool call lifecycle
- 하나의 skill invocation lifecycle
- 하나의 task lifecycle

### 21.2 causation_id 사용 기준

직접적인 원인 관계가 명확할 때만 사용한다.

예:

- `task.started` 의 직접 원인이 `agent.spawned`
- `alert.raised` 의 직접 원인이 `token.anomaly_detected`

### 21.3 trace_id 사용 기준

세션 내 큰 흐름을 따라갈 때 사용한다.

예:

- 특정 agent가 수행한 작업 줄기 전체
- 하나의 상위 사용자 요청에서 파생된 task/skill/tool 흐름

### 21.4 parent_ref 결정 우선순위

1. raw 로그에 명시된 관계
2. adapter가 가진 구조 정보
3. 시간/순서/stream 기반 휴리스틱
4. 추론 불가 시 orphan 처리

---

## 22. 이벤트 저장 전략

### 22.1 파일 구조

```text
sessions/<session_id>/
├─ session.json
├─ events.jsonl
├─ raw-events.jsonl
├─ projections/
│  ├─ session-summary.json
│  ├─ active-tasks.json
│  ├─ token-breakdown.json
│  └─ alerts.json
├─ tasks/
│  ├─ <task_id>.json
│  └─ <task_id>.log
└─ reports/
   └─ session-summary.md
```

### 22.2 저장 순서

1. raw 이벤트 수신
2. canonical event 생성
3. `events.jsonl` append
4. projector 갱신
5. projection snapshot 주기적 저장

### 22.3 이벤트 정렬 기준

기본 정렬은 `occurred_at` 이지만, 저장과 재생 안전성을 위해 아래 둘 다 유지하는 것이 좋다.

- `occurred_at`: 사용자에게 보여줄 실제 사건 시간
- `ingested_seq`: 저장 순서 정수값

동일 timestamp 다발 상황에서 replay 안정성을 위해 `ingested_seq` 가 유용하다.

---

## 23. Replay 규칙

replay는 CCMonit 개발과 디버깅에 매우 중요하다.

### 23.1 replay 입력

- canonical `events.jsonl`
- 필요 시 `raw-events.jsonl`

### 23.2 replay 보장 사항

- 동일 이벤트 순서로 재생 가능해야 한다.
- refresh interval 과 무관하게 deterministic 모드 지원이 좋다.
- 실시간 속도/배속/일시정지 기능은 차후 확장 가능하다.

### 23.3 replay 시 주의점

- projector는 wall clock 이 아니라 event time 기반으로 동작할 수 있어야 한다.
- idle/stuck 판단은 replay 모드에서 가상 clock 으로 재계산하는 구조가 바람직하다.

---

## 24. 집계/프로젝션 모델 권장 목록

canonical event 위에 최소 아래 read model 을 둔다.

### 24.1 SessionSummaryProjection

- session 메타
- active/completed/failed task 수
- active agent 수
- tool count by type
- token totals
- adapter health
- current alerts

### 24.2 ActiveTaskProjection

- 현재 running/waiting/blocked task 목록
- 관련 agent/team
- 마지막 activity
- idle duration
- token snapshot

### 24.3 SkillRecentProjection

- 최근 skill invocation 목록
- 상태
- 소요 시간
- 관련 task

### 24.4 ToolUsageProjection

- 툴별 호출 수
- 최근 호출 시각
- 평균 duration
- 에러율
- 토큰 기여도

### 24.5 FileActivityProjection

- 최근 파일 변경 목록
- file burst 여부
- 관련 task/agent

### 24.6 AlertProjection

- active alert 목록
- severity
- ack 상태
- 연관 엔티티

---

## 25. 토큰 전략을 위한 추가 규칙

사용자가 특히 원했던 부분이므로 토큰 이벤트는 아래 원칙을 강하게 권장한다.

### 25.1 토큰 값은 summary update 로 다룬다

고빈도 chunk 단위 토큰보다, 의미 있는 시점에 스냅샷을 남긴다.

예:

- task 시작 시점 추정 초기값
- tool 종료 시점 확정값
- 세션 주기 집계 스냅샷
- 세션 종료 최종값

### 25.2 total 과 breakdown 은 분리해서 다룬다

`total` 만 있는 경우가 많으므로 아래처럼 허용해야 한다.

- input/output/cache 분해값 없음
- total만 exact 또는 estimated
- cost는 token과 별도의 measured value

### 25.3 source_detail 을 남긴다

추후 토큰 전략을 세우려면 값의 출처를 알아야 한다.

예:

- `source_detail: "parsed from usage line"`
- `source_detail: "estimated from output chars / heuristic v1"`
- `source_detail: "aggregated from tool.finished events"`

### 25.4 누락 자체도 이벤트로 다룰 수 있다

반복적으로 토큰이 빠지는 경우는 중요한 운영 정보다.
따라서 필요하면 `token.anomaly_detected` 로 남긴다.

---

## 26. 민감정보 및 보안 규칙

이벤트 모델은 raw 내용 저장을 허용하되, 다음 원칙을 따른다.

### 26.1 payload에는 full text를 직접 넣지 않는다

기본 canonical event 에는 preview 중심으로 넣고, 전체 본문은 raw store 또는 별도 artifact 로 분리한다.

### 26.2 capture_policy를 명시한다

특히 tool.called/tool.finished 는 아래 정책을 둔다.

- `none`: 본문 미저장
- `preview`: 일부만 저장
- `full`: 전체 저장
- `masked`: 저장하되 민감정보 마스킹

### 26.3 마스킹 결과도 provenance를 남긴다

값이 원문인지 마스킹본인지 구분돼야 디버깅이 쉬워진다.

---

## 27. MVP 우선 이벤트 목록

초기 구현에서는 아래 이벤트만 우선 지원해도 충분하다.

### 27.1 반드시 구현

- `session.started`
- `session.finished`
- `adapter.started`
- `adapter.health_changed`
- `task.started`
- `task.status_changed`
- `task.finished`
- `task.failed`
- `skill.started`
- `skill.finished`
- `tool.called`
- `tool.finished`
- `file.changed`
- `token.updated`
- `alert.raised`
- `alert.resolved`

### 27.2 있으면 좋은 것

- `task.retry_scheduled`
- `task.stderr_detected`
- `task.stuck_detected`
- `file.linked`
- `file.burst_detected`
- `token.anomaly_detected`
- `user.question_detected`
- `report.generated`

### 27.3 후순위

- `team.*`
- `tool.stdout_detected`
- `tool.stderr_detected`
- `system.note_detected`
- `alert.suppressed`

---

## 28. 예시 이벤트

### 28.1 task.started 예시

```json
{
  "event_id": "evt_01JXYZ...",
  "event_version": 1,
  "event_name": "task.started",
  "category": "task",
  "occurred_at": "2026-04-10T11:23:14.000Z",
  "observed_at": "2026-04-10T11:23:14.241Z",
  "session_id": "sess_abc123",
  "correlation_id": "task_t_001",
  "trace_id": "trace_root_01",
  "actor": {
    "entity_type": "agent",
    "entity_id": "agent_reviewer"
  },
  "target": {
    "entity_type": "task",
    "entity_id": "task_quality_eval"
  },
  "parent_ref": {
    "entity_type": "agent",
    "entity_id": "agent_reviewer",
    "relation_accuracy": "exact"
  },
  "source": {
    "adapter_kind": "claude-log-tail",
    "adapter_instance_id": "adapter_main",
    "parser_version": "0.1.0",
    "stream": "stdout",
    "raw_type": "task-line"
  },
  "accuracy": "exact",
  "confidence_score": 1,
  "payload": {
    "task_id": "task_quality_eval",
    "title": "Code quality evaluation",
    "category": "code-quality",
    "started_at_accuracy": "exact"
  }
}
```

### 28.2 token.updated 예시

```json
{
  "event_id": "evt_01JXYZ...",
  "event_version": 1,
  "event_name": "token.updated",
  "category": "token",
  "occurred_at": "2026-04-10T11:25:48.000Z",
  "observed_at": "2026-04-10T11:25:48.009Z",
  "session_id": "sess_abc123",
  "correlation_id": "task_t_001",
  "target": {
    "entity_type": "task",
    "entity_id": "task_quality_eval"
  },
  "source": {
    "adapter_kind": "claude-log-tail",
    "adapter_instance_id": "adapter_main",
    "parser_version": "0.1.0",
    "stream": "stdout",
    "raw_type": "usage-line"
  },
  "accuracy": "derived",
  "confidence_score": 0.88,
  "payload": {
    "scope_type": "task",
    "scope_id": "task_quality_eval",
    "token_usage": {
      "input": { "value": 1100, "accuracy": "estimated", "confidence_score": 0.62 },
      "output": { "value": 155, "accuracy": "exact" },
      "total": { "value": 1330, "accuracy": "derived", "source_detail": "session delta allocation" }
    }
  }
}
```

---

## 29. 구현 권장 순서

### Phase 1. 이벤트 최소 세트

- session/task/skill/tool/file/token/alert 핵심 이벤트 구현
- JSONL 저장
- 기본 projector 3개(session summary, active tasks, alerts)

### Phase 2. 관계 보강

- task ↔ skill ↔ tool 상관관계 추론
- orphan 처리
- file ↔ task 링크 강화

### Phase 3. 운영성 강화

- parse_failed burst 감지
- adapter health 고도화
- cost estimation
- richer token anomaly rules

### Phase 4. 회고/분석 강화

- replay
- session comparison
- top token consumers
- task timeline export

---

## 30. 결론

CCMonit의 이벤트 모델은 단순 로그 뷰어가 아니라, **Claude Code 작업 흐름을 재구성하는 표준 관측 레이어** 여야 한다.
이 문서의 핵심은 아래 세 가지다.

1. **외부 포맷을 직접 믿지 말고 canonical event로 정규화할 것**
2. **불확실성 자체를 accuracy/confidence/source로 모델링할 것**
3. **UI, 저장, 리포트, replay가 모두 동일한 이벤트 스트림을 기반으로 동작하게 할 것**

이 원칙을 지키면 초기 MVP는 단순하게 시작하되, 이후 harness deep integration, 웹 대시보드, 세션 비교 분석까지 무리 없이 확장할 수 있다.
