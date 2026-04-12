# Worklog — cli-bootstrap

## [2026-04-12] CLI 부트스트랩 완성

### Task 1: 부트스트랩 unblock
- `apps/cli/src/bootstrap/load-config.ts`: throw → return {}
- `apps/cli/src/bootstrap/create-app.ts`: start()/stop() → no-op async

### Task 2: ink TUI 최소 셸
- ink 7 + react 19 + @types/react 설치
- `apps/cli/tsconfig.json`: jsx: react-jsx, .tsx include 추가
- `apps/cli/src/tui/components/app.tsx` 신규: cyan 테두리, 제목, 상태, q 종료
- `apps/cli/src/tui/app-screen.ts`: ink render/unmount/waitUntilExit 구현
- `apps/cli/src/commands/monitor.command.ts`: AppScreen mount + waitUntilExit 연결

### Task 3: tsup 빌드 파이프라인
- tsup 설치 (devDep)
- `apps/cli/tsup.config.ts` 신규: ESM, node20, shebang, workspace 패키지 번들
- `apps/cli/package.json`: version 0.0.0, bin.ccmonit, files: dist, main → dist
- `scripts/dev.ts`: tsx 직접 실행
- `scripts/build.ts`: CLI 빌드 위임

### 결과
- `pnpm build` → `apps/cli/dist/main.js` (3.69KB, shebang 포함)
- `node dist/main.js --help` 동작 확인
- renderToString으로 TUI 출력 확인 (실제 터미널 테스트는 사용자 확인 필요)
- tsc --noEmit 통과, lint 통과
