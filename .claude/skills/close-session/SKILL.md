---
name: close-session
description: 세션을 마감하고 다음 세션용 handoff를 정리한다
disable-model-invocation: true
---

# close-session

이 스킬은 세션 종료 단계에서 **다음 세션이 바로 이어질 수 있게** scratch와 handoff를 정리한다.

## 먼저 읽을 것
- `.claude/scratch/worklog.md`
- `.claude/scratch/next-prompt.md`
- `.claude/scratch/open-questions.md`
- 현재 세션에서 수정한 파일 목록
- 필요 시 `docs/log.md`

## 해야 할 일
1. 이번 세션에서 끝낸 것을 정리한다.
2. 아직 안 끝난 것을 정리한다.
3. 다음 세션 첫 작업을 1줄로 적는다.
4. 열린 질문을 정리한다.
5. `worklog.md`, `next-prompt.md`, `open-questions.md`에 반영할 내용을 제안한다.
   - `worklog.md`는 **최신 3-5개 batch를 유지**한다. 내용이 지나치게 길어지면 오래된 항목을 1줄 요약으로 축약한다.

## 출력 형식
- 완료 항목
- 미완료 항목
- 다음 세션 첫 작업
- 열린 질문
- scratch 반영 초안
