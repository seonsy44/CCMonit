---
name: implement-application-batch
description: application 계층의 작은 배치를 구현한다. 유스케이스, DTO, 포트, 매퍼 작업에 사용한다.
argument-hint: [배치명 또는 유스케이스명]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit Glob Grep
---

대상 배치: **$ARGUMENTS**

## 목표
`packages/application` 계층에서 유스케이스 중심의 작은 구현 단위를 완성한다.

## 규칙
- 도메인에 없는 의미를 application에 새로 만들지 않는다.
- 포트는 기술 상세가 아니라 추상 계약으로 유지한다.
- DTO는 화면/리포트 소비 목적이 명확할 때만 추가한다.
- 한 배치에서 유스케이스 1개 또는 매퍼 1쌍 정도만 처리한다.

## 결과 요구
- 어떤 유스케이스/포트/DTO를 손봤는지
- 아직 infra 연결이 남아있는지
- 다음으로 구현할 배치가 무엇인지