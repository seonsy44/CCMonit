---
id: ARCH-ADAPTER-CONTRACT
title: "CCMonit 어댑터 계약"
type: spec
status: active
owners: [architecture]
updated: 2026-04-10
tags: [architecture, adapter]
links:
  - system-overview.md
  - ../knowledge/concepts/canonical-event.md
---
# CCMonit 어댑터 계약

## 목적
Claude Code 로그 포맷 변화가 상위 계층으로 번지지 않도록, infra adapter 의 입력/출력 계약을 정의한다.

## 입력 계층
어댑터는 아래 원천을 다룰 수 있다.
- Claude Code 로그 파일 tail
- harness stdout/stderr 스트림
- 파일 시스템 변경 이벤트
- 후속 확장을 위한 외부 collector

## 어댑터 출력
어댑터는 상위 계층에 raw 레코드 또는 canonical event 후보를 넘길 수 있다.
다만 application/domain 은 raw 포맷을 직접 읽지 않는다.

## 권장 인터페이스
```ts
interface EventSourcePort {
  start(): Promise<void>;
  stop(): Promise<void>;
  onEvent(listener: (event: unknown) => void): void;
  onError(listener: (error: Error) => void): void;
}
```

## 계약 원칙
- 파싱 실패는 예외로 앱을 종료시키지 않는다.
- 실패한 raw 레코드는 evidence 와 함께 별도 로그로 남길 수 있다.
- 토큰 값이 없더라도 이벤트는 버리지 않는다.
- 관계 추론 실패 시 orphan 으로 유지하고 후처리 가능하게 둔다.

## Claude adapter 세부 책임
- 세션 감지
- raw 로그 테일
- 이벤트 분리
- 토큰 추출
- adapter health 보고

## filesystem adapter 세부 책임
- 변경 파일 경로 수집
- 수정/생성/삭제 이벤트 감지
- workspace snapshot 읽기 보조

## reports adapter 세부 책임
- application 이 넘긴 report dto 를 포맷별 산출물로 저장