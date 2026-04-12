# Open Questions

## 릴리스 관련

### npm publish 접근성 (cli-bootstrap 이관)
- `@ccmonit/cli`는 scoped 패키지 → 기본이 private
- 공개 배포 시 `npm publish --access public` 필요
- 또는 `package.json`에 `"publishConfig": { "access": "public" }` 추가 고려
- 참고: `apps/cli/package.json`

