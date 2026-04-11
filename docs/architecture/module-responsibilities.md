---
id: ARCH-MODULE-RESP
title: "CCMonit 모듈 책임 명세서"
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, modules]
links:
  - system-overview.md
  - ../decisions/ADR-001-monorepo-structure.md
---
# CCMonit 모듈 책임 명세서

## 1. 문서 목적

본 문서는 **CCMonit(Claude Code Monitor)** 의 모듈 경계를 정의하고,
각 모듈이 **무엇을 책임지고 무엇을 책임지지 않는지**를 명확히 하기 위해 작성한다.

이 문서의 목적은 다음과 같다.

- 모듈 간 책임 중복을 줄인다.
- 이벤트 기반 구조에서 발행/구독 관계를 명확히 한다.
- Claude Code로 구현할 때 파일 생성 단위와 작업 분할 기준을 제공한다.
- 이후 기능이 늘어나더라도 모듈 경계가 쉽게 무너지지 않도록 기준을 만든다.

본 문서는 앞서 작성한 다음 문서들과 함께 읽는 것을 전제로 한다.

- 초기 폴더 구조 초안
- 이벤트 모델 명세서

---

## 2. 설계 원칙

### 2.1 수집과 해석을 분리한다
외부 로그를 읽는 책임과, 그것을 내부 의미 있는 이벤트로 해석하는 책임은 분리한다.

- adapter 는 **읽기/수집** 를 담당한다.
- parser/normalizer 는 **해석/정규화** 를 담당한다.
- domain/application 은 **판단/집계/정책** 을 담당한다.

### 2.2 상태 계산과 저장을 분리한다
저장은 append-only 이벤트 중심으로 하고,
현재 상태는 projector/read model 에서 계산한다.

- event store 는 이벤트를 보존한다.
- projector 는 현재 상태를 계산한다.
- TUI 는 계산된 상태를 그린다.

### 2.3 UI는 도메인 규칙을 소유하지 않는다
TUI 패널은 표시 책임만 가진다.
다음과 같은 판단을 UI에서 하면 안 된다.

- stuck 판정
- 토큰 급증 판정
- task ↔ skill 추론
- accuracy/confidence 판단

이런 책임은 application/domain 쪽에 둔다.

### 2.4 외부 시스템 변화는 infra에서 흡수한다
Claude Code 로그 포맷이나 harness 출력 포맷 변화는 infra 계층이 먼저 흡수해야 한다.
상위 계층이 raw 포맷에 직접 의존하면 안 된다.

### 2.5 한 모듈은 한 종류의 변화 이유만 가져야 한다
예를 들어,

- TUI 변경 때문에 token 계산 로직이 같이 바뀌면 안 된다.
- SQLite 교체 때문에 domain entity 가 바뀌면 안 된다.
- adapter 추가 때문에 전체 화면 구조가 흔들리면 안 된다.

---

## 3. 전체 모듈 계층

CCMonit의 권장 모듈 계층은 다음과 같다.

```text
Bootstrap / CLI
        ↓
Application
        ↓
Domain
        ↑
Infrastructure
        ↓
Read Model / Presenter
        ↓
TUI
```

정확히 말하면 의존 방향은 아래처럼 잡는다.

```text
CLI/TUI → Application → Domain
Infra   → Application Port / Domain Type 구현
Presenter → Read Model
```

핵심 원칙:

- **Domain** 은 가장 안쪽이다.
- **Application** 은 유스케이스를 조합한다.
- **Infrastructure** 는 외부 입출력을 연결한다.
- **TUI** 는 표시와 사용자 상호작용만 담당한다.
- **Presenter** 는 읽기 모델을 화면 친화 형태로 바꾼다.

---

## 4. 최상위 모듈 목록

CCMonit의 핵심 모듈은 다음과 같이 나눈다.

1. bootstrap 모듈
2. config 모듈
3. command/cli 모듈
4. adapter 모듈
5. parser/normalizer 모듈
6. event bus 모듈
7. event store 모듈
8. projector/read model 모듈
9. domain model 모듈
10. metrics/token 모듈
11. alerting 모듈
12. reporting 모듈
13. tui 모듈
14. presenter 모듈
15. replay/diagnostics 모듈
16. masking/security 모듈
17. test fixture/support 모듈

아래에서 각 모듈의 책임을 자세히 정의한다.

---

## 5. 모듈별 책임 명세

## 5.1 Bootstrap 모듈

### 책임

- 애플리케이션 시작 순서를 정의한다.
- 설정 로드, 저장소 초기화, adapter 연결, TUI 시작을 조합한다.
- 종료 시그널을 처리하고 안전하게 shutdown 한다.
- 개발 모드/실행 모드/report 모드/replay 모드 진입점을 정리한다.

### 입력

- CLI 인자
- 환경 변수
- 설정 파일

### 출력

- 실행 중인 application context
- 초기화된 service container 또는 dependency graph

### 소유 개념

- app lifecycle
- boot order
- graceful shutdown

### 하지 말아야 할 일

- 비즈니스 규칙 판단
- 토큰 계산
- 로그 파싱
- TUI 상세 렌더링

---

## 5.2 Config 모듈

### 책임

- 설정 스키마를 정의한다.
- 파일/환경 변수/CLI override 를 병합한다.
- 기본값을 공급한다.
- 잘못된 설정을 조기에 검증한다.

### 주요 설정 예시

- log source path
- workspace root
- SQLite 경로
- JSONL 저장 여부
- token estimation policy
- alert threshold
- masking policy
- refresh interval

### 하지 말아야 할 일

- 설정을 참조해 직접 동작 실행
- 설정 변경 이력 저장
- UI 상태 저장

---

## 5.3 Command / CLI 모듈

### 책임

- 사용자 진입 명령을 정의한다.
- `monitor`, `report`, `replay`, `doctor` 같은 실행 모드를 제공한다.
- 실행 옵션을 받아 bootstrap 에 전달한다.

### 대표 명령

- `ccmonit monitor`
- `ccmonit report --session <id>`
- `ccmonit replay --input <path>`
- `ccmonit doctor`

### 하지 말아야 할 일

- command 내부에서 직접 파일 tail 처리
- command 내부에서 session summary 계산
- command 내부에서 TUI 패널 상태를 직접 조립

---

## 5.4 Adapter 모듈

### 책임

- 외부 시스템에서 raw signal 을 읽어온다.
- 외부 소스별 차이를 흡수한다.
- adapter health 상태를 보고한다.
- raw 입력을 parser/normalizer 로 전달한다.

### 하위 adapter 예시

- claude-code adapter
- harness adapter
- filesystem adapter
- git adapter(향후)
- process adapter(향후)

### 입력

- 로그 파일
- stdout/stderr stream
- filesystem watcher event
- 프로세스 상태

### 출력

- raw records
- adapter status event

### 소유 개념

- source connectivity
- raw ingestion position
- file tail offset
- adapter heartbeat

### 하지 말아야 할 일

- canonical event schema 직접 설계 변경
- session summary 생성
- stuck 판정
- 토큰 정책 결정

---

## 5.5 Parser / Normalizer 모듈

### 책임

- raw 입력을 canonical event 로 변환한다.
- source metadata, accuracy, confidence, evidence 를 설정한다.
- 중복/파손/부분 로그를 최대한 안전하게 해석한다.
- structural parent 와 inferred parent 를 구분한다.

### 세부 하위 책임

- raw line parser
- semantic extractor
- entity resolver
- canonical event mapper

### 출력

- `session.started`
- `task.started`
- `skill.started`
- `tool.finished`
- `token.updated`
- `alert.signal.detected`
- 기타 canonical event

### 하지 말아야 할 일

- 이벤트 저장
- 최종 집계 리포트 생성
- UI별 텍스트 포맷팅

---

## 5.6 Event Bus 모듈

### 책임

- canonical event 를 내부 소비자들에게 배포한다.
- projector, alerting, event store, reporter 등이 같은 흐름을 공유하도록 한다.
- 이벤트 순서/전달 정책을 관리한다.

### 핵심 요구

- publish/subscribe 지원
- 적어도 프로세스 내부 순서 보장
- handler 실패가 전체 프로세스를 즉시 깨지 않도록 보호
- backpressure 또는 queue overflow 대응 지점 제공

### 하지 말아야 할 일

- 이벤트를 해석해서 상태 계산
- 특정 TUI 패널에 직접 의존
- 저장소 포맷 정책 소유

---

## 5.7 Event Store 모듈

### 책임

- canonical event 를 append-only 로 저장한다.
- 재생(replay) 가능한 원본 로그를 남긴다.
- 세션 단위, 시점 단위, category 단위 조회를 지원한다.
- deduplication key 또는 insert idempotency 를 지원한다.

### 저장 형태

- JSONL / NDJSON
- SQLite events table
- optional rotated archives

### 소유 개념

- persistence
- retention policy
- flush policy
- storage schema version

### 하지 말아야 할 일

- UI용 summary 계산
- alert threshold 판단
- token cost 계산 정책 결정

---

## 5.8 Projector / Read Model 모듈

### 책임

- 이벤트 스트림을 현재 조회 가능한 상태로 변환한다.
- session, task, skill, tool, token, alert read model 을 유지한다.
- TUI와 리포터가 재사용 가능한 조회 형태를 제공한다.

### 대표 read model 예시

- active sessions summary
- running task tree
- agent/team hierarchy snapshot
- token breakdown snapshot
- hot files list
- unresolved alerts list
- recent event timeline

### 소유 개념

- projection state
- read-side aggregation
- last-known status

### 하지 말아야 할 일

- 원본 raw 로그 직접 읽기
- SQLite schema migration 처리
- TUI 위젯 배치

---

## 5.9 Domain Model 모듈

### 책임

- 시스템의 핵심 개념을 정의한다.
- session, agent, task, skill, tool usage, token usage, alert 의 의미를 모델링한다.
- 상태 전이 규칙, 불변식, 도메인 계산 로직을 제공한다.

### 핵심 엔티티/VO 예시

- Session
- Agent
- Task
- SkillInvocation
- ToolCall
- TokenUsage
- Alert
- AccuracyStatus
- ConfidenceScore
- Duration

### 대표 규칙 예시

- finished 된 task 는 다시 running 으로 돌아가지 않는다.
- exact 와 estimated 토큰은 같은 bucket 으로 합산하되 accuracy breakdown 을 유지한다.
- orphan tool event 는 특정 조건 충족 시에만 task 에 귀속된다.

### 하지 말아야 할 일

- 파일 시스템 접근
- TUI 이벤트 키 바인딩 관리
- SQLite 쿼리 작성

---

## 5.10 Application 모듈

### 책임

- 유스케이스 단위로 여러 모듈을 조합한다.
- domain service, store, reporter, projector 를 orchestrate 한다.
- 모니터링 시작/종료, 리포트 생성, replay 실행 같은 흐름을 관리한다.

### 대표 유스케이스

- start monitoring
- stop monitoring
- ingest event
- build session summary
- detect alerts
- generate report
- replay session
- export token strategy report

### 소유 개념

- use case boundary
- transaction-like flow coordination
- port 기반 의존 관리

### 하지 말아야 할 일

- raw log 포맷 직접 파싱
- low-level terminal rendering
- DB vendor specific 세부 구현 소유

---

## 5.11 Metrics / Token 모듈

### 책임

- 토큰 관련 계산과 표시용 요약을 담당한다.
- input/output/cache/system/tool 별 usage breakdown 을 계산한다.
- exact/derived/estimated/unavailable 상태를 함께 관리한다.
- budget, burst, drift, anomaly 를 탐지하기 위한 수치를 만든다.

### 대표 기능

- token aggregation by session
- token aggregation by task/skill/tool
- rate per minute 계산
- sudden spike 감지용 지표 계산
- cost estimation 후보 계산
- accuracy mix ratio 계산

### 추가 권장 기능

- per-tool average token cost
- long-context pressure 지표
- retry waste ratio
- no-progress token burn 지표

### 하지 말아야 할 일

- 실제 billing truth 단정
- UI 색상 결정
- source adapter health 관리

---

## 5.12 Alerting 모듈

### 책임

- 이상 징후를 판정한다.
- 판정 결과를 alert event 와 alert read model 로 기록한다.
- 경고 해제 조건과 lifecycle 을 관리한다.

### 대표 alert 유형

- stuck execution
- no output for N seconds
- token spike
- parse failure burst
- adapter disconnected
- orphan events surge
- file churn anomaly
- excessive retry loop
- task timeout suspicion

### 소유 개념

- threshold
- hysteresis
- deduplication of repeated alerts
- alert severity

### 하지 말아야 할 일

- 단순 raw 로그 저장
- TUI 팝업 렌더링 세부 처리
- 세션 리포트 작성 전체를 소유

---

## 5.13 Reporting 모듈

### 책임

- 세션 종료 후 혹은 요청 시점에 리포트를 만든다.
- 이벤트, read model, token 집계를 결합해 서술형 결과를 생성한다.
- markdown/json/csv 등 다양한 export 형식을 지원한다.

### 리포트 예시 섹션

- session overview
- agent/task timeline
- token usage summary
- tool usage summary
- notable alerts
- hot files
- failures / retries
- retrospective recommendations

### 하지 말아야 할 일

- 실시간 UI state 소유
- adapter 에 직접 접근해 live read 수행
- alert 판정 기준 정의

---

## 5.14 Presenter 모듈

### 책임

- read model 을 화면 친화적인 view model 로 변환한다.
- 숫자/시간/정렬/축약 문자열을 사용자 친화 형태로 만든다.
- 화면마다 필요한 가공만 수행한다.

### 예시

- `12_430` → `12.4k`
- duration formatting
- accuracy badge text
- severity badge label
- panel row ordering

### 하지 말아야 할 일

- raw event 읽기
- 영속화
- 도메인 추론

---

## 5.15 TUI 모듈

### 책임

- 화면 레이아웃을 구성한다.
- 패널, 리스트, 테이블, footer, shortcut, detail view 를 렌더링한다.
- 사용자 입력(키보드, 포커스 이동, drill-down) 을 받는다.
- presenter 가 준 view model 을 그린다.

### 패널 예시

- header panel
- session summary panel
- subagent/team panel
- task tree panel
- skill/tool panel
- token breakdown panel
- file activity panel
- alerts panel
- event log panel
- footer/help panel

### 하지 말아야 할 일

- 이벤트 모델 정의
- 토큰 계산 규칙 소유
- SQLite 조회 쿼리 조합
- alert 판정

---

## 5.16 Replay / Diagnostics 모듈

### 책임

- 저장된 이벤트/로그를 재생한다.
- 재현 가능한 디버깅 환경을 제공한다.
- adapter/parser/projector 품질을 검증한다.
- doctor 명령으로 환경 이상 여부를 점검한다.

### 대표 기능

- recorded JSONL replay
- speed-adjusted replay
- parser comparison replay
- projection consistency check
- missing field ratio report
- health/self-check

### 하지 말아야 할 일

- 실시간 모니터링 메인 흐름에 직접 침투
- production alert 기준을 변경

---

## 5.17 Masking / Security 모듈

### 책임

- 민감정보를 저장 전/표시 전 마스킹한다.
- 경로, 키, 토큰, 계정정보, secrets 후보를 감지한다.
- redaction policy 를 적용한다.

### 예시 대상

- API key 형태 문자열
- access token
- 특정 절대경로
- 이메일/계정식별자
- 민감한 prompt/raw content 일부

### 하지 말아야 할 일

- 이벤트 의미 해석
- 토큰 계산
- UI 레이아웃 처리

---

## 5.18 Test Fixture / Support 모듈

### 책임

- 샘플 raw 로그, canonical event fixture, replay sample 을 관리한다.
- parser/projector/reporter 테스트용 입력 세트를 제공한다.
- 회귀 테스트를 쉽게 만든다.

### 하지 말아야 할 일

- 프로덕션 코드에서 실제 정책 결정
- 테스트 fixture 를 domain truth 로 간주

---

## 6. 모듈 간 의존 규칙

## 6.1 허용 의존

### 허용 예시

- CLI → Bootstrap / Application
- Bootstrap → Config / Application / Infra / TUI
- Adapter → Parser / Normalizer
- Application → Domain / Ports
- Infra Storage → Application Port 구현
- Projector → Domain types / Canonical Event
- Presenter → Read Model
- TUI Panel → Presenter output

### 비허용 예시

- TUI → Raw adapter 직접 호출
- Domain → SQLite 구현 의존
- Domain → blessed/neo-blessed 의존
- Parser → TUI panel state 직접 갱신
- Adapter → Report writer 직접 호출
- Presenter → Event store 직접 조회

---

## 6.2 계층별 의존 방향 요약

```text
TUI ───────┐
Presenter ─┼→ Application → Domain
CLI ───────┘        ↑
                    │
         Infra implementations
```

Infrastructure 는 상위 추상(ports, types) 에 의존해야 하며,
상위 계층이 infra concrete class 를 직접 알아서는 안 된다.

---

## 7. 이벤트 발행/구독 책임

아래는 권장 발행/구독 관계다.

## 7.1 Adapter

### 발행

- raw ingestion signal
- adapter health signal
- parser input candidate

### 구독

- 없음 또는 control command 최소한만

## 7.2 Parser / Normalizer

### 발행

- canonical event
- parse failure event
- unresolved relation event

### 구독

- raw signal

## 7.3 Event Store

### 발행

- store write result(optional)
- persistence failure event

### 구독

- canonical event

## 7.4 Projector

### 발행

- read model updated event(optional)

### 구독

- canonical event

## 7.5 Alerting

### 발행

- alert.raised
- alert.updated
- alert.resolved

### 구독

- canonical event
- read model snapshot(optional)

## 7.6 Metrics / Token

### 발행

- token.summary.updated
- token.anomaly.detected

### 구독

- token related canonical event
- task/skill/tool lifecycle event

## 7.7 Reporting

### 발행

- report.generated
- report.failed

### 구독

- explicit command request
- session.finished(optional trigger)

## 7.8 TUI

### 발행

- ui intent event(optional, 내부용)

### 구독

- read model update
- alert update
- session selection change

---

## 8. 모듈 경계에서 자주 생기는 충돌과 권장 해법

## 8.1 Parser가 projector 역할까지 해버리는 문제

### 나쁜 징후

- parser 내부에서 `activeTaskCount++` 같은 상태 누적을 해버림
- parser 결과가 바로 패널 데이터 구조임

### 권장 해법

- parser 는 canonical event 까지만 만든다.
- 상태 누적은 projector 로 넘긴다.

---

## 8.2 TUI가 도메인 규칙을 소유해버리는 문제

### 나쁜 징후

- 화면 코드에서 stuck 조건을 직접 계산함
- 화면 코드에서 severity 를 판정함

### 권장 해법

- alerting/application 에서 판정 후,
- TUI 는 결과 badge 만 그림.

---

## 8.3 Infra가 상위 정책을 소유해버리는 문제

### 나쁜 징후

- SQLite 저장 모듈이 “이 이벤트는 중요하니 alert 띄우자”를 결정함

### 권장 해법

- infra 는 저장과 읽기만 책임진다.
- 중요도 판단은 alerting/domain/application 에 둔다.

---

## 8.4 Reporting과 Presenter 책임이 섞이는 문제

### 나쁜 징후

- presenter 가 markdown 문단까지 작성함
- reporter 가 화면 row formatting 을 재사용 없이 다시 구현함

### 권장 해법

- presenter 는 실시간 화면용 가공
- reporter 는 문서 구조와 서술 책임
- 공통 포맷 유틸은 shared 로 분리

---

## 9. MVP 기준 모듈 우선순위

초기 구현에서는 아래 순서가 가장 안전하다.

### 1단계: 최소 수집/표시 루프

- bootstrap
- config
- command/cli
- claude-code adapter
- parser/normalizer
- event bus
- event store(JSONL)
- projector
- presenter
- tui

### 2단계: 운영성 확보

- metrics/token
- alerting
- masking/security
- doctor/diagnostics

### 3단계: 분석성 강화

- SQLite event store
- reporting
- replay
- session comparison
- anomaly refinement

---

## 10. Claude Code에게 작업을 나눠 줄 때의 권장 단위

Claude Code로 구현할 때는 모듈 책임 단위가 곧 작업 단위가 되는 것이 좋다.
다음처럼 나누는 것을 권장한다.

### 작업 묶음 A: Canonical Event 기반

- event types 정의
- canonical envelope 구현
- accuracy/confidence/source 모델 구현

### 작업 묶음 B: 수집 파이프라인 기반

- claude log watcher
- parser
- normalizer
- event bus publish

### 작업 묶음 C: 상태 계산 기반

- session projector
- task projector
- token projector
- alert projector

### 작업 묶음 D: UI 기반

- root layout
- summary panel
- task tree panel
- token panel
- alerts panel

### 작업 묶음 E: 운영/품질 기반

- masking
- diagnostics
- replay
- reporter

이렇게 나누면 각 작업이 서로 덜 충돌하고,
Claude Code가 문맥을 잃어도 책임 단위가 비교적 명확하게 유지된다.

---

## 11. 권장 책임 소유 매트릭스

| 기능/개념 | 주 책임 모듈 | 보조 모듈 | 비고 |
|---|---|---|---|
| 로그 읽기 | Adapter | Bootstrap | raw ingestion |
| canonical event 생성 | Parser/Normalizer | Domain types | raw → standard |
| 이벤트 전파 | Event Bus | Application | 내부 publish/subscribe |
| 이벤트 저장 | Event Store | Infra | append-only |
| 현재 상태 계산 | Projector | Domain | read model |
| 상태 전이 규칙 | Domain | Application | invariant 포함 |
| 모니터링 시작/중지 | Application | Bootstrap/CLI | use case |
| 토큰 집계 | Metrics/Token | Domain/Projector | accuracy 포함 |
| 이상 징후 판정 | Alerting | Metrics/Projector | severity 포함 |
| 세션 리포트 생성 | Reporting | Projector/Metrics | markdown/json/csv |
| 화면용 포맷팅 | Presenter | Shared utils | TUI 친화 가공 |
| 실시간 화면 렌더링 | TUI | Presenter | 패널/UI 책임 |
| 재생/진단 | Replay/Diagnostics | Event Store | replay/doctor |
| 마스킹 | Masking/Security | Adapter/Reporter/TUI | 저장 전/표시 전 |

---

## 12. 모듈 책임 명세의 완료 조건

이 문서가 실제 구현에 반영되었다고 보려면 다음이 만족되어야 한다.

- 폴더 구조와 파일명이 본 문서의 책임 분리와 대체로 일치한다.
- 하나의 파일이 서로 다른 변화 이유를 과도하게 동시에 갖지 않는다.
- TUI 파일에서 domain 계산 로직이 거의 보이지 않는다.
- adapter 파일에서 UI 구조나 report 문단 생성이 보이지 않는다.
- parser 출력이 canonical event 로 수렴한다.
- projector 가 read model 을 유일한 상태 계산 진입점으로 가진다.

---

## 13. 최종 권장 한 줄 정리

CCMonit의 모듈 책임은 아래 문장으로 요약할 수 있다.

> **Adapter는 읽고, Parser는 해석하고, Store는 남기고, Projector는 계산하고, Alerting은 판단하고, Reporter는 정리하고, TUI는 보여준다.**

이 한 줄이 깨지기 시작하면, 이후 유지보수 난이도와 문맥 혼잡도가 빠르게 올라갈 가능성이 크다.