# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-08-06

Initial release, regenerated from [vbonk/repo-template v2.0.0](https://github.com/vbonk/repo-template/releases/tag/v2.0.0).

### Added

- Task-management REST API over `node:http` with zero runtime dependencies: CRUD on `/tasks`, status filtering, `/health`
- Typed validation with per-field error reporting; structured `ApiError` responses (400/404/405/500)
- In-memory `TaskStore` with UUID ids and update timestamps
- Unit tests (store, validation) and integration tests (real HTTP round-trips); 80% coverage thresholds enforced in CI
- TypeScript strict ESM build, ESLint 9 flat config with typescript-eslint, `.nvmrc` (Node 22)
- ADR-006 recording the zero-runtime-dependency and in-memory-storage decision
- Everything inherited from repo-template v2.0.0: hardened CI (SHA-pinned actions), secret scanning, Dependabot with cooldown, CODEOWNERS prompt-injection defense, signed releases with SBOM, issue/label taxonomy, Claude Code + Codex agent configuration

[Unreleased]: https://github.com/vbonk/repo-template-example/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/vbonk/repo-template-example/releases/tag/v0.1.0
