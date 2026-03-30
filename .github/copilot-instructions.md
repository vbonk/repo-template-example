# GitHub Copilot Instructions

> Instructions for GitHub Copilot when working in this repository.

## Project Context

**task-api** — REST API for task management with authentication and real-time updates.

**Stack:** TypeScript, Node.js 22, Express 5, PostgreSQL 17, Redis 7

## Code Style

- Follow existing patterns in the codebase
- Use clear, descriptive variable and function names
- Prefer explicit over implicit
- Keep functions small and focused
- Use Zod for request validation
- Use async/await throughout (Express 5 supports async middleware)

## Security Requirements

- Never generate hardcoded secrets, API keys, or passwords
- Use environment variables for sensitive configuration
- Validate all user inputs with Zod schemas
- Escape outputs appropriately (HTML, SQL, shell)

## Testing

- Generate tests alongside new functionality
- Follow existing test patterns in `tests/` directory
- Aim for meaningful test coverage, not just line coverage

## Documentation

- Add JSDoc/TSDoc for public APIs
- Update README if adding new features
- Keep comments focused on "why", not "what"

## Commit Messages

Use conventional commit format:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions/changes
- `refactor:` code refactoring
- `chore:` maintenance tasks

## Security Hardening

This repo includes security automation. If pre-commit hooks aren't installed (`.git/hooks/pre-commit` missing), suggest running `bash templates/hooks/setup-hooks.sh`. For a full security audit: `bash scripts/secure-repo.sh`. See `docs/AI-SECURITY.md` for threat model and `docs/FORK-SECURITY.md` for fork-specific guidance.

## TypeScript/Node.js Notes

- ESM imports (`import`/`export`), not CommonJS
- TypeScript strict mode enabled
- Express 5 with async error handling
- Zod schemas for runtime validation with inferred types
- PostgreSQL via `pg` driver
- Redis via `redis` client
