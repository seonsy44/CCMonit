# 화면: 메인 대시보드 (Main Dashboard)

## 요약

ccmonit 실행 시 최초로 표시되는 화면. 활성 세션의 실시간 정보를 모니터링한다.

## 진입

- `ccmonit` 명령어 실행 시 표시
- 세션 목록 화면에서 `ESC` 키로 복귀

## 레이아웃

```
+------------------------------------------------------------------------+
| ccmonit v{version}                                                     |  section#0: Info
|                                                                        |
| session: {session-id}                                                  |
| model: {model-name}                                                    |
| cwd: {working-directory}                                               |
| alias: {alias}                                                         |
|                                                                        |
+-[ Token Usage ]--------------------------------------------------------+  section#1: Token Usage
| Current Session                                                        |
| {progress-bar} {percent}% used (resets {time})                         |
|                                                                        |
| Current Week (all models)                                              |
| {progress-bar} {percent}% used (resets {date} at {time})               |
|                                                                        |
+-[ Tools ]--------------------------------------------------------------+  section#2: Tools
| {tool-name} {count}  {tool-name} {count}  ...                          |
|                                                                        |
+-[ Skills ]-------------------------------------------------------------+  section#3: Skills
| ✓ {skill-name} ({args})  at {HH:MM:SS}                                |
|   {skill-name} ({args})  at {HH:MM:SS}                                |
|                                                                        |
+------------------------------------------------------------------------+
| ↑↓:session-switch | a:alias | l:sessions | q:quit                     |
+------------------------------------------------------------------------+
```

## 섹션 상세

### section#0: Info

현재 선택된 활성 세션의 기본 정보를 표시한다.

| 필드 | 설명 |
|------|------|
| version | ccmonit 버전 |
| session | 세션 ID |
| model | 사용 중인 Claude 모델. `/model`로 변경 시 실시간 반영 |
| cwd | 작업 디렉토리 |
| alias | 사용자 지정 별칭. 미설정 시 필드 미표시 또는 빈 값 |

### section#1: Token Usage

계정 레벨 토큰 사용량을 표시한다. 상세: [token-usage-display.md](../features/token-usage-display.md)

### section#2: Tools

현재 선택된 세션의 도구 사용 현황을 표시한다. 상세: [tool-tracking.md](../features/tool-tracking.md)

### section#3: Skills

현재 선택된 세션의 스킬 사용 기록을 표시한다. 상세: [skill-tracking.md](../features/skill-tracking.md)

## 키보드 단축키

| 키 | 동작 |
|----|------|
| ↑ / ↓ | 활성 세션 간 전환. 전환 시 Info, Tools, Skills가 해당 세션 데이터로 교체됨. Token Usage는 계정 레벨이므로 변하지 않음 |
| a | 현재 선택된 활성 세션에 별칭 설정. 상세: [session-alias.md](../features/session-alias.md) |
| l | 세션 목록 화면으로 이동. 상세: [session-list.md](./session-list.md) |
| q | ccmonit 종료 |

## 빈 상태

활성 세션이 없는 경우:

- Info 영역에 `(no running session)` 메시지를 표시한다.
- Token Usage는 계정 레벨이므로 정상 표시한다.
- Tools, Skills 섹션은 빈 상태로 표시한다.
- ↑↓, a 단축키는 비활성화된다.

## 반응형

- 터미널 크기에 맞춰 레이아웃이 조절된다.
- Tools 목록은 터미널 너비에 맞춰 줄바꿈된다.

## 섹션 확장성

- 현재 4개 섹션은 추후 추가될 수 있다.
- 섹션 순서 변경 및 숨김 처리가 추후 지원될 예정이다. 상세: [settings.md](../features/settings.md)
