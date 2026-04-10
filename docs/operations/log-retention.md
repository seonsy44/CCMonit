---
id: OPS-LOG-RETENTION
title: "CCMonit 로그 보존 정책"
type: policy
status: active
owners: [operations]
updated: 2026-04-10
tags: [operations, retention]
links: [[[architecture/storage-model]], [[operations/docs-operations]]]
---
# CCMonit 로그 보존 정책

## 목적
로그는 회고와 재현에 중요하지만, 계속 쌓이면 저장 비용과 민감정보 위험이 커진다.

## 권장 보존 단위
- raw canonical event: 우선 보존
- 세션 요약 스냅샷: 장기 보존
- report 산출물: 장기 보존
- raw 원문 evidence: 선택 보존 또는 마스킹

## 권장 정책 예시
- 최근 7일: 원본 이벤트 즉시 접근 가능
- 30일 이후: 압축 보관
- 90일 이후: 요약만 남기고 원본 삭제 검토

## 민감정보 처리
- 경로, 토큰 문자열, 사용자 입력 일부는 마스킹 대상
- 필요 시 저장 전 마스킹과 조회 시 추가 마스킹을 병행

## 운영 팁
- 세션 단위 파일 분리
- 크기 기준 rotate 정책 사용
- 보고서 생성 후 주요 지표만 별도 인덱싱
