# Next Prompt — cli-bootstrap

## 이 흐름은 완료됨

CLI 부트스트랩 목표 달성:
- `pnpm dev` → TUI 실행 가능 (실제 터미널에서 확인)
- `pnpm build` → npm 배포 가능한 bin 포함 dist 생성
- `npm install -g @ccmonit/cli` → `ccmonit` 명령어 사용 가능

## 다음 세션에서 할 것

**옵션 A** (권장): 도메인 서비스 구현 시작
- `/flow-start` (기본 개발 흐름)
- 대상: `cost-estimation` 서비스 또는 `session-health` 서비스
- scratch 경로: `.claude/scratch/` (기본)

**옵션 B**: TUI 패널 내용 채우기
- `/flow-start TUI 패널 구현`
- monitor 화면에 실제 데이터 표시 (session summary panel 등)
- 선행 조건: application 포트 / 프로젝터가 어느 정도 갖춰져야 함

현재 상태에서는 옵션 A가 더 자연스러운 순서다.
