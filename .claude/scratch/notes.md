# Notes

- 중요한 구조 변경은 `docs/log.md` 반영이 필요한지 같이 판단한다.
- 새 문서를 만들면 `docs/index.md`, `docs/registry/page-index.md` 갱신 여부를 확인한다.
- npm publish 접근성 이슈 (@ccmonit/cli scoped): scoped 패키지는 기본 private이므로 `--access public` 플래그 필요. 또는 패키지명을 unscoped로 변경 검토.
- manual-validation 완료 (2026-04-13). glob 패턴 수정(`**/*.jsonl`), tool_result content 배열 처리, 에러 격리 강화. 상세 기록: `.claude/scratch/smoke-test-findings.md`
- realtime-fix 완료 (2026-04-15). session.started 경합 조건 수정(누적 카운트 보존), 슬래시 커맨드 skill 감지 추가, projectSkills 필드명 수정. 미해결: skill.finished/session.finished 이벤트 미구현(JSONL에 종료 시점 없음).
