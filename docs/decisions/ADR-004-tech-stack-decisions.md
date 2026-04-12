---
id: ADR-004
title: 'ADR-004: 핵심 라이브러리 기술 결정'
type: decision
status: active
owners: [architecture]
updated: 2026-04-11
tags: [adr, tech-stack, tui, sqlite, file-watch]
links:
  - ../architecture/module-responsibilities.md
  - ../architecture/storage-model.md
---

# ADR-004: 핵심 라이브러리 기술 결정

## 상태

Active

## 맥락

CCMonit의 구현에 필요한 핵심 외부 라이브러리가 아직 확정되지 않은 상태였다.
TUI 렌더링, SQLite 바인딩, 파일 감시, 테스트 프레임워크 네 가지 영역에서 결정이 필요했다.

## 결정

### 1. TUI 라이브러리: ink

- React 스타일 선언적 컴포넌트 모델
- 상태 관리, 컴포넌트 재사용, 조건부 렌더링이 React와 동일
- Textual(Python)을 고려했으나 Node.js/TypeScript 프로젝트와 호환 불가
- blessed/neo-blessed 대비 코드 가독성과 유지보수성이 우수

### 2. SQLite 바인딩: better-sqlite3

- 동기 API로 코드가 간결
- 네이티브 빌드 필요하지만 로컬 CLI 도구이므로 문제 없음
- sql.js(WASM) 대비 성능 우수

### 3. 파일 감시: Node.js fs.watch (내장)

- 외부 의존성 제로
- macOS에서는 FSEvents 기반으로 동작
- 필요 시 chokidar로 전환 가능하나, 초기에는 내장 API로 충분

### 4. 테스트 프레임워크: 보류

- 현재 스캐폴드 단계에서 테스트 프레임워크 도입은 시기상조
- 구현이 진행되면 vitest 도입 예정

## 결과

- 의존성 추가는 각 모듈 구현 시점에 진행
- package.json에는 아직 추가하지 않음
