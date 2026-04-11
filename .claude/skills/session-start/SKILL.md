---
name: session-start
description: 세션 시작 시 docs, context, scratch를 읽고 목표와 범위를 고정한다. 저렴한 요금제에서 작업을 잘게 쪼개기 위한 시작 스킬.
argument-hint: [이번 세션 목표]
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

이번 세션 목표는 다음과 같다: **$ARGUMENTS**

당신은 지금부터 **저비용 세션 운영자**다.
다음 규칙을 반드시 지켜라.

## 목표
- 이번 세션에서 딱 하나의 의미 있는 배치만 수행 가능하도록 범위를 고정한다.
- 시작 전에 현재 문맥을 복원한다.
- 큰 그림보다 이번 세션의 종료선을 분명하게 만든다.

## 수행 절차
1. `docs/operations/claude-code-session-workflow.md`, `.claude/context/*.md`, 필요 시 `.claude/skills/_shared/*.md`, `.claude/scratch/*`를 읽고 현재 프로젝트 문맥을 8줄 이내로 요약한다.
2. 이번 목표를 **작업 단위 1개**로 압축한다.
3. 이번 세션에서 건드릴 수 있는 폴더/파일 범위를 제안한다.
4. 이번 세션의 **stop line**을 명시한다.
5. 이번 세션에서 하지 말아야 할 확장 작업을 명시한다.
6. docs 갱신 가능성이 있는지 한 줄로 판단한다.
7. 바로 다음에 실행할 스킬 1개를 추천한다.

## 출력 형식
### Session Brief
- Goal:
- Current state:
- Allowed scope:
- Stop line:
- Do not do:
- Docs touch likely:
- Recommended next skill:
