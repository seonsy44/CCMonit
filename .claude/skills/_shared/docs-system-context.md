# Docs System Context for Skills

문서 source of truth 읽는 순서:
1. `docs/index.md`
2. `docs/_system/DOCS_SCHEMA.md`
3. `docs/registry/page-index.md`
4. 관련 기준 문서
5. `docs/log.md`

언제 docs 를 같이 고쳐야 하나:
- 기능 범위 / 사용자 시나리오 / 화면이 바뀔 때 -> `docs/product/*`
- 경계 / 이벤트 / 저장 / 책임이 바뀔 때 -> `docs/architecture/*`
- 운영 루틴 / 토큰 전략 / 장애 대응이 바뀔 때 -> `docs/operations/*`
- 반복 설명 가치가 생긴 개념일 때 -> `docs/knowledge/*`
- 새 출처를 흡수할 때 -> `docs/sources/*`, `docs/registry/source-index.md`
- 중요한 변경 이력일 때 -> `docs/log.md`
