---
id: CONCEPT-STUCK_DETECTION
title: "Stuck Detection"
type: concept
status: active
owners: [architecture]
updated: 2026-04-10
tags: [concept, stuck-detection]
links:
  - ../overview/project-map.md
---


# Stuck Detection

## 정의
작업이 장시간 의미 있는 진전을 보이지 않을 때 이를 경고하는 규칙 집합이다.

## 단순 시간 초과와의 차이
오래 걸리는 작업이 모두 stuck는 아니다.  
따라서 다음을 함께 본다.

- 마지막 의미 있는 이벤트 시각
- 최근 tool 실행 여부
- 최근 파일 변경 여부
- 오류 반복 여부
- 장시간 정상 실행이 예상되는 작업인지

## 운영 포인트
stuck 경고는 민감하게 두되, false positive를 줄이기 위해 threshold와 evidence를 함께 표시해야 한다.

## 관련 문서
- [operations/troubleshooting](../../operations/troubleshooting.md)
- [knowledge/entities/alert](../entities/alert.md)