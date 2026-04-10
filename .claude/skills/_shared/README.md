# Shared Skill Context

이 디렉토리는 **여러 스킬이 공통으로 읽는 실행 컨텍스트**를 둔다.

원칙:
- 사람/일반 세션 공용의 안정 요약은 `.claude/context/`에 둔다.
- 스킬이 빠르게 읽기 위한 축약 실행 컨텍스트는 `.claude/skills/_shared/`에 둔다.
- 이 디렉토리의 문서는 설명보다 **실행 우선순위, source of truth, 주의점**을 짧게 담는다.
- 내용이 프로젝트 전반의 안정된 사실로 승격되면 `.claude/context/`나 `docs/`로 옮긴다.

권장 파일:
- `product-context.md`
- `architecture-context.md`
- `docs-system-context.md`
- `glossary-context.md`
