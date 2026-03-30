# task-api

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/vbonk/repo-template-example/actions/workflows/ci.yml/badge.svg)](https://github.com/vbonk/repo-template-example/actions/workflows/ci.yml)
[![Built with repo-template](https://img.shields.io/badge/Built%20with-repo--template-blue?style=flat-square)](https://github.com/vbonk/repo-template)

REST API for task management with authentication and real-time updates.

## Features

- Task CRUD operations (create, read, update, delete)
- JWT-based authentication
- Redis caching for fast task list retrieval
- Input validation with Zod schemas
- PostgreSQL for persistent storage
- Health check endpoint

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express 5
- **Language:** TypeScript (strict mode, ESM)
- **Database:** PostgreSQL 17
- **Cache:** Redis 7
- **Validation:** Zod
- **Testing:** Vitest

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 17
- Redis 7

### Setup

```bash
# Clone the repository
git clone https://github.com/vbonk/repo-template-example.git
cd repo-template-example

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and Redis connection details

# Start development server
npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm test` | Run tests |
| `npm run lint` | Lint code |

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive JWT | No |
| `GET` | `/tasks` | List all tasks | Yes |
| `POST` | `/tasks` | Create a task | Yes |
| `GET` | `/tasks/:id` | Get a single task | Yes |
| `PUT` | `/tasks/:id` | Update a task | Yes |
| `DELETE` | `/tasks/:id` | Delete a task | Yes |
| `GET` | `/health` | Health check | No |

## Project Structure

```
src/
  index.ts          # Express server entry point
  routes/           # Route handlers (tasks, auth, health)
  middleware/        # Auth, validation, error handling
  models/           # Database models and queries
  services/         # Business logic layer
tests/              # Test files
docs/               # Architecture docs and ADRs
scripts/            # Automation scripts
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `REDIS_URL` | Yes | — | Redis connection string |
| `JWT_SECRET` | Yes | — | Secret for JWT signing |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |

See `.env.example` for a complete template.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

[MIT](LICENSE)
