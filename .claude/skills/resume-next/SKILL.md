---
name: resume-next
description: 세션 종료 시 다음 세션이 바로 이어질 수 있도록 scratch 기반 handoff 초안을 만든다.
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

## 목표
이번 세션이 끝난 뒤 다음 세션이 **다시 파악부터 시작하지 않도록** handoff를 남긴다.

## 수행 절차
1. 이번 세션에서 바뀐 파일과 완료 항목을 정리한다.
2. 아직 안 끝난 항목과 열려 있는 질문을 구분한다.
3. 다음 세션에서 가장 먼저 해야 할 **가장 작은 다음 배치**를 하나만 고른다.
4. 다음 세션의 stop line 과 범위 제한을 적는다.
5. 필요 시 같이 갱신할 docs 후보를 적는다.
6. `.claude/scratch/next-prompt.md`, `worklog.md`, `open-questions.md`에 반영할 초안 형태로 정리한다.

## 출력 형식
### Resume Brief
- Completed this session:
- Remaining work:
- Best next batch:
- Next stop line:
- Docs candidates:
- Scratch updates:
