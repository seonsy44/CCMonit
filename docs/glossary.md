# Glossary

## 세션 (Session)

Claude Code의 하나의 컨텍스트 창 단위. 다음 행위는 현재 세션을 종료하고 새 세션을 시작한 것으로 간주한다:

- `/clear` 사용
- `/compact` 사용
- 터미널 닫기
- `exit`으로 Claude Code 종료

## 활성 세션 (Active Session)

현재 실행 중인 Claude Code 세션. 메인 대시보드에서 모니터링 대상이 된다.

## 종료 세션 (Terminated Session)

종료된 Claude Code 세션. 세션 목록 화면에서 조회할 수 있으며, 사용자가 명시적으로 삭제하지 않는 한 영속적으로 보존된다.

## 도구 (Tool)

Claude Code가 작업 수행 시 사용하는 기능 단위. 예: Bash, Edit, Read, Grep, Agent, Write 등.

## 스킬 (Skill)

Claude Code에서 슬래시 커맨드(`/`)로 호출되는 작업 단위. 사용자 또는 Claude AI가 호출할 수 있다. 예: `/dev-sprint`, `/dev-open`, `/commit` 등.

## 별칭 (Alias)

사용자가 세션을 쉽게 식별하기 위해 부여하는 이름. 활성 세션에서만 설정 가능하며, 종료 후에도 유지된다.

## 섹션 (Section)

대시보드 화면을 구성하는 정보 블록 단위. 현재 MVP에서는 Info, Token Usage, Tools, Skills 4개 섹션이 존재한다.

## 토큰 사용량 (Token Usage)

사용자의 Claude Code 계정에 대한 API 사용량 정보. 세션별이 아닌 계정 레벨 데이터이다.
