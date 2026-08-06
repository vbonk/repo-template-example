# ADR-006: Zero Runtime Dependencies and In-Memory Storage

## Status

Accepted (2026-08-06)

## Context

This repository is the living example for [vbonk/repo-template](https://github.com/vbonk/repo-template). It needs a real application — one that builds, lints, tests with enforced coverage, and releases — but the application is not the product. Every runtime dependency added to the example:

- widens the supply-chain surface the template's security posture is supposed to showcase shrinking,
- generates Dependabot PR noise unrelated to what the example demonstrates,
- and adds services (databases, caches) that CI and contributors would have to provision.

The previous iteration of this example claimed Express, PostgreSQL, Redis, and JWT auth — and shipped zero tests, because exercising that stack requires infrastructure the example never had. The claims outran the verification.

## Decision

- Serve HTTP with Node's built-in `node:http` module. **No runtime dependencies at all** — `package.json` has only `devDependencies` (TypeScript, Vitest, ESLint, tsx).
- Store tasks in an in-memory `Map` behind a `TaskStore` class. No database.
- Keep the store behind a small interface so a real project swapping in persistence changes one module, not the app.

## Consequences

### Positive

- `npm audit` has nothing to audit at runtime; Dependabot npm PRs touch only dev tooling.
- Tests (including integration tests over real HTTP) run anywhere Node 22 runs — no services, no containers, no mocks of infrastructure.
- Every capability the README claims is exercised by CI. The example demonstrates the template's standard: claim only what is verified.

### Negative

- Tasks are lost on process restart — unacceptable for a real service, fine for an example, and documented in the README.
- No framework conventions to lean on; routing and body parsing are hand-rolled (kept small and tested).

### Neutral

- A real project initialized from the template would likely choose a framework and a database; ADR-006 is the example explaining why it did not. The repository structure, CI wiring, and security posture transfer either way.
