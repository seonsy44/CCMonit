# 화면: 세션 목록 (Session List)

## 요약

종료된 세션들의 목록을 조회하고 관리하는 화면.

## 진입

- 메인 대시보드에서 `l` 키

## 레이아웃

```
+------------------------------------------------------------------------+
| ccmonit v{version}                                                     |  section#0: Info
|                                                                        |
| session: {session-id}                                                  |
| cwd: {working-directory}                                               |
| alias: {alias}                                                         |
|                                                                        |
+-[ Tools ]--------------------------------------------------------------+  section#1: Tools
| {tool-name} {count}  {tool-name} {count}  ...                          |
|                                                                        |
+-[ Skills ]-------------------------------------------------------------+  section#2: Skills
|   {skill-name} ({args})  at {HH:MM:SS}                                |
|   {skill-name} ({args})  at {HH:MM:SS}                                |
|                                                                        |
+------------------------------------------------------------------------+
| ESC:back | ↑↓:session-switch | r:report | d:delete | q:quit           |
+------------------------------------------------------------------------+
```

## 메인 대시보드와의 차이

| 항목 | 메인 대시보드 | 세션 목록 |
|------|--------------|----------|
| 대상 세션 | 활성 세션 | 종료 세션 |
| model 필드 | 표시 | 미표시 |
| Token Usage 섹션 | 표시 | 미표시 |
| Skills 상태 아이콘 | ✓(사용중) / 흐림(완료) 구분 | 구분 없음 (모두 동일) |
| alias 변경 | 가능 (a키) | 불가 |

## section#0: Info

현재 선택된 종료 세션의 기본 정보를 표시한다.

| 필드 | 설명 |
|------|------|
| version | ccmonit 버전 |
| session | 세션 ID |
| cwd | 작업 디렉토리 |
| alias | 별칭 (읽기 전용) |

- model 필드는 종료 세션에서는 표시하지 않는다.
- Token Usage 섹션은 종료 세션 화면에서 표시하지 않는다.

## section#1: Tools

해당 종료 세션의 최종 도구 사용 현황. 상세: [tool-tracking.md](../features/tool-tracking.md)

## section#2: Skills

해당 종료 세션의 스킬 사용 기록. 상세: [skill-tracking.md](../features/skill-tracking.md)

- 모든 스킬이 동일한 스타일로 표시된다 (사용중/완료 구분 없음).

## 키보드 단축키

| 키 | 동작 |
|----|------|
| ESC | 메인 대시보드로 복귀 |
| ↑ / ↓ | 종료 세션 간 전환. 전환 시 Info, Tools, Skills가 해당 세션 데이터로 교체됨 |
| r | 선택된 세션의 레포트 보기 (MVP 미구현, 추후 지원 예정) |
| d | 선택된 세션 삭제. 상세: [session-history.md](../features/session-history.md) |
| q | ccmonit 종료 |

## 정렬

- 종료 세션은 시작 시각 순서로 나열된다.

## 빈 상태

- 종료된 세션이 없는 경우 `(no terminated sessions)` 등의 메시지를 표시한다.

## 반응형

- 터미널 크기에 맞춰 레이아웃이 조절된다.
