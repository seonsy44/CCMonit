---
name: update-context
description: 세션 종료 전에 worklog, next-prompt, open-questions를 업데이트하고 필요 시 docs 변경 후보까지 정리해 다음 세션이 바로 이어질 수 있게 만든다.
argument-hint: [이번 배치명]
disable-model-invocation: true
allowed-tools: Read Edit Write MultiEdit
---

이번 배치명: **$ARGUMENTS**

## 목표
이번 세션의 문맥을 파일로 남긴다. 다음 세션의 토큰 낭비를 줄이는 것이 목적이다.

## 반드시 수정할 파일
- `.claude/scratch/worklog.md`
- `.claude/scratch/next-prompt.md`
- `.claude/scratch/open-questions.md` (필요 시)

## 함께 검토할 파일
- `docs/log.md`
- 관련 `docs/product/*`, `docs/architecture/*`, `docs/operations/*`

## 작성 규칙
- worklog에는 사실만 쓴다.
- next-prompt는 다음 세션에서 그대로 붙여넣을 수 있게 완성형 문장으로 쓴다.
- 다음 세션의 stop line 과 수정 허용 범위를 꼭 포함한다.
- 아직 안 끝난 위험 / 가정을 open-questions에 남긴다.
- 이번 세션이 기준 문서에 영향을 주었다면 docs 갱신 필요 여부를 명시한다.

## 출력 형식
### Context Updated
- Updated files:
- Docs follow-up:
- Next session goal:
- Next recommended skill: