# Open Questions — cli-bootstrap

## 해결됨
- TUI 프레임워크: ink (ADR-004 기결정)
- 패키지명: @ccmonit/cli (scoped), bin: ccmonit

## 남은 질문

### npm publish 접근성
- `@ccmonit/cli`는 scoped 패키지 → 기본이 private
- 공개 배포 시 `npm publish --access public` 필요
- 또는 `package.json`에 `"publishConfig": { "access": "public" }` 추가

### 실제 터미널 TUI 확인
- 이 세션에서 non-TTY 환경으로 raw mode 테스트 불가
- 사용자가 `pnpm dev` 또는 `cd apps/cli && pnpm dev` 로 직접 확인 필요
