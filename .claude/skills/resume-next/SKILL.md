---
name: resume-next
description: 다음 세션 시작 시 scratch/context 문서와 docs 로그를 읽고 이어서 할 가장 작은 다음 배치를 제안한다.
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

## 목표
이전 세션의 문맥을 빠르게 복원하고 바로 시작 가능한 다음 배치를 제안한다.

## 수행 절차
1. `.claude/context/`, `.claude/scratch/`, `docs/log.md`를 우선 읽는다.
2. 마지막 세션의 완료 항목과 미완료 항목을 구분한다.
3. 지금 바로 진행 가능한 가장 작은 다음 배치를 하나만 고른다.
4. 이번 세션의 stop line 과 범위 제한을 다시 적는다.
5. 필요 시 같이 갱신할 docs 후보를 적는다.
6. 지금 바로 이어서 쓸 수 있는 프롬프트를 마지막에 제공한다.

## 출력 형식
### Resume Brief
- Last completed batch:
- Remaining work:
- Best next batch:
- Stop line:
- Docs candidates:
- Prompt to paste:
