# task-api

[![CI](https://github.com/vbonk/repo-template-example/actions/workflows/ci.yml/badge.svg)](https://github.com/vbonk/repo-template-example/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built from repo-template v2.0.0](https://img.shields.io/badge/Built%20from-repo--template%20v2.0.0-238636)](https://github.com/vbonk/repo-template/releases/tag/v2.0.0)

A small task-management REST API in TypeScript with **zero runtime dependencies** — and the living example of [vbonk/repo-template](https://github.com/vbonk/repo-template) v2.0.0.

> [!NOTE]
> **This repo exists to show the template in action.** Everything around the code — CI, security hardening, agent configuration, issue taxonomy, release signing — came from the template. The diff between this repo and a pristine template checkout is exactly what initializing a real project looks like: placeholders filled, one stack enabled, an app built inside it.

## What the template provided

| Concern | What this repo got |
|---------|-------------------|
| AI agents | `CLAUDE.md` (Claude Code) + `AGENTS.md` (Codex / open standard), filled for this project — plus 5 slash commands, 6 skills, hook templates, and an example sub-agent under `.claude/` |
| CI | `.github/workflows/ci.yml` with the Node.js section enabled: lint → test (with coverage thresholds) → build on every push and PR |
| Security | SHA-pinned Actions, secret scanning on PRs, Dependabot (actions + npm, 3-day cooldown), CODEOWNERS guarding AI config, branch + tag rulesets via `scripts/secure-repo.sh` |
| Releases | Tag `v*` → draft release → Sigstore signing → SBOM → publish (draft stays unpublished if signing fails) |
| Governance | Issue templates, 25+ labels, PR template, code of conduct, security policy with incident runbook |
| Decisions | ADRs in [docs/decisions/](docs/decisions/) — five inherited from the template, plus [ADR-006](docs/decisions/006-zero-runtime-dependencies.md) recording this project's own stack choice |

## The API

In-memory task management over plain `node:http`. No framework, no database — the app is deliberately small so the repository around it stays legible.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `GET` | `/tasks` | List tasks, optional `?status=todo\|in_progress\|done` |
| `POST` | `/tasks` | Create a task (`title` required) |
| `GET` | `/tasks/:id` | Fetch one task |
| `PATCH` | `/tasks/:id` | Update `title`, `description`, or `status` |
| `DELETE` | `/tasks/:id` | Delete a task |

Validation errors return structured JSON (`400` with per-field issues); unknown routes `404`; wrong methods `405`. Tasks live in memory and are lost on restart — by design, see [ADR-006](docs/decisions/006-zero-runtime-dependencies.md).

## Getting started

Requires Node.js 22+ (see `.nvmrc`).

```bash
git clone https://github.com/vbonk/repo-template-example.git
cd repo-template-example
npm ci
npm run dev
```

```bash
# Create a task
curl -s -X POST localhost:3000/tasks \
  -H 'content-type: application/json' \
  -d '{"title": "Try the template", "status": "in_progress"}'

# List in-progress tasks
curl -s 'localhost:3000/tasks?status=in_progress'
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start with live reload (tsx) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled build |
| `npm test` | Vitest with V8 coverage — 80% thresholds enforced |
| `npm run lint` | ESLint (flat config, typescript-eslint) |
| `npm run typecheck` | `tsc --noEmit` across src and tests |

## Project structure

```
src/            Task model, validation, store, router, HTTP server
tests/unit/     Store + validation units
tests/integration/  Real HTTP round-trips against the server
docs/           ARCHITECTURE.md, ADRs, AI-SECURITY.md, guides
scripts/        secure-repo.sh, labels.sh, my-tasks.sh, audit-compliance.sh
.claude/        Claude Code commands, skills, agents, hook templates
templates/      Hooks, linting, testing, tooling starters (from the template)
```

## Want this for your own project?

```bash
gh repo create my-project --template vbonk/repo-template --public --clone
cd my-project && bash templates/hooks/setup-hooks.sh && bash scripts/secure-repo.sh
```

Then open it with Claude Code and run `/project:init-template`. This repository is what you end up with.

## License

[MIT](LICENSE)

---

> **See also:** [CLAUDE.md](CLAUDE.md) | [AGENTS.md](AGENTS.md) | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | [SECURITY.md](SECURITY.md) | [vbonk/repo-template](https://github.com/vbonk/repo-template)
