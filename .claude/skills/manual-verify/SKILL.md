---
name: manual-verify
description: 작은 배치 구현 직후 타입, 경계, 문서 정합성, TODO 상태를 빠르게 수동 검증한다.
argument-hint: [검증 대상 배치]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

검증 대상: **$ARGUMENTS**

## 목표
저비용 세션에서 긴 자동 검증 대신, 다음 배치로 넘어가기 전에 핵심 위험만 빠르게 점검한다.

## 확인 항목
1. import / export 경계가 의도대로인지
2. domain 판단이 UI 쪽으로 새지 않았는지
3. raw 포맷이 상위 계층으로 새지 않았는지
4. TODO가 책임 경계와 일치하는지
5. `docs/`와 `.claude/`에 반영이 필요한 구조 변화가 있는지
6. 새 파일이 생겼다면 index / registry 갱신이 필요한지

## 출력 형식
### Manual Verify
- Checked:
- Findings:
- Docs impact:
- Safe to continue:
