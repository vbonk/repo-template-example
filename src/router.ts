import { badRequest, methodNotAllowed, notFound } from './errors.js';
import type { TaskStore } from './store.js';
import { TASK_STATUSES, isTaskStatus } from './types.js';
import { parseCreateTask, parseUpdateTask } from './validation.js';

export interface ApiRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
}

export interface ApiResponse {
  status: number;
  body?: unknown;
}

export interface Router {
  handle(req: ApiRequest): ApiResponse;
}

const TASK_ID_ROUTE = /^\/tasks\/([^/]+)$/;

export function createRouter(store: TaskStore): Router {
  function handleHealth(req: ApiRequest): ApiResponse {
    if (req.method !== 'GET') throw methodNotAllowed(['GET']);
    return { status: 200, body: { status: 'ok' } };
  }

  function handleTasks(req: ApiRequest): ApiResponse {
    switch (req.method) {
      case 'GET': {
        const statusParam = req.query.get('status');
        if (statusParam !== null && !isTaskStatus(statusParam)) {
          throw badRequest('Invalid status filter', [
            { field: 'status', message: `must be one of: ${TASK_STATUSES.join(', ')}` },
          ]);
        }
        return { status: 200, body: { tasks: store.list(statusParam ?? undefined) } };
      }
      case 'POST': {
        const task = store.create(parseCreateTask(req.body));
        return { status: 201, body: task };
      }
      default:
        throw methodNotAllowed(['GET', 'POST']);
    }
  }

  function handleTaskById(req: ApiRequest, id: string): ApiResponse {
    switch (req.method) {
      case 'GET': {
        const task = store.get(id);
        if (!task) throw notFound(`No task with id ${id}`);
        return { status: 200, body: task };
      }
      case 'PATCH': {
        const task = store.update(id, parseUpdateTask(req.body));
        if (!task) throw notFound(`No task with id ${id}`);
        return { status: 200, body: task };
      }
      case 'DELETE': {
        if (!store.delete(id)) throw notFound(`No task with id ${id}`);
        return { status: 204 };
      }
      default:
        throw methodNotAllowed(['GET', 'PATCH', 'DELETE']);
    }
  }

  return {
    handle(req: ApiRequest): ApiResponse {
      if (req.path === '/health') return handleHealth(req);
      if (req.path === '/tasks') return handleTasks(req);
      const idMatch = TASK_ID_ROUTE.exec(req.path);
      if (idMatch?.[1]) return handleTaskById(req, idMatch[1]);
      throw notFound(`No route for ${req.path}`);
    },
  };
}
