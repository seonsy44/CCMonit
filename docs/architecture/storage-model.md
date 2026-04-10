---
id: ARCH-STORAGE-MODEL
title: "CCMonit 스토리지 모델"
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, storage]
links:
  - ../operations/log-retention.md
  - ../knowledge/entities/token-usage.md
---
# CCMonit 스토리지 모델

## 목적
CCMonit의 저장소는 실시간 표시와 사후 분석을 모두 지원해야 한다. 따라서 이벤트 원장과 파생 읽기 모델을 분리한다.

## 저장 전략
1. **원본 이벤트 저장**
   - canonical event 를 append-only 로 저장
   - 기본 형식은 NDJSON
   - 장기적으로는 SQLite 인덱싱을 병행 가능

2. **세션 상태 저장**
   - 세션 종료 시점 또는 주기적으로 요약 스냅샷 저장
   - 빠른 리스트/검색을 위한 경량 read model 저장 가능

3. **리포트 산출물 저장**
   - markdown / json / csv 리포트 저장
   - 세션 ID 기준으로 경로를 고정

## 권장 디렉터리
```text
data/
├─ events/
│  └─ {sessionId}.ndjson
├─ snapshots/
│  └─ {sessionId}.json
├─ reports/
│  └─ {sessionId}/
│     ├─ report.md
│     ├─ report.json
│     └─ token-breakdown.csv
└─ sqlite/
   └─ ccmonit.db
```

## canonical event 최소 필드
- `eventId`
- `eventKind`
- `sessionId`
- `timestamp`
- `actor`
- `payload`
- `source`
- `accuracy`
- `confidenceScore`
- `correlationId`
- `causationId`

## 스냅샷 최소 필드
- 세션 상태
- active agent / task 목록
- 누적 토큰 집계
- 최근 파일 활동
- 최근 알림
- adapter health

## SQLite 역할
SQLite는 필수가 아니라 선택이다.
- NDJSON 만으로도 MVP를 시작할 수 있다.
- 이후 세션 목록, 고급 검색, 기간별 집계를 위해 SQLite 인덱스를 붙일 수 있다.

## 보존 정책
- raw 이벤트는 회고와 replay 를 위해 우선 보존
- 오래된 세션은 압축 보관
- 민감한 텍스트는 저장 전 마스킹 가능