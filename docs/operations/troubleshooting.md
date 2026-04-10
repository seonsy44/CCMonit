---
id: OPS-TROUBLESHOOTING
title: "CCMonit 문제 해결 가이드"
type: guide
status: active
owners: [operations]
updated: 2026-04-10
tags: [operations, troubleshooting]
links:
  - docs-operations.md
  - ../knowledge/concepts/stuck-detection.md
---
# CCMonit 문제 해결 가이드

## 증상: 화면은 멈춘 것처럼 보이는데 실제 작업은 진행 중이다
확인할 것:
- adapter health
- 마지막 raw 입력 시각
- canonical event 생성 시각
- TUI refresh 루프 상태

## 증상: 토큰 값이 비어 있다
확인할 것:
- 현재 어댑터가 exact 값을 제공하는지
- extractor fallback 이 derived / estimated 로 동작하는지
- 이벤트가 orphan 으로 저장되지는 않았는지

## 증상: 특정 task 로그가 비어 있다
확인할 것:
- correlationId / causationId 매핑
- task 추론 규칙
- raw 레코드 파싱 실패 로그

## 증상: 파일 활동이 과도하게 많다
확인할 것:
- 감시 범위에 build output 이 포함됐는지
- debounce / ignore 패턴 설정
- snapshot reader 와 live watcher 중복 여부

## 증상: stuck 경고가 너무 자주 뜬다
확인할 것:
- idle 임계치
- 장시간 tool 실행을 정상 동작으로 허용했는지
- 마지막 의미 있는 이벤트 정의가 너무 엄격하지 않은지