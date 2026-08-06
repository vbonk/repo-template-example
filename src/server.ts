import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { ApiError, badRequest, payloadTooLarge } from './errors.js';
import { createRouter } from './router.js';
import { TaskStore } from './store.js';

const MAX_BODY_BYTES = 1_048_576; // 1 MiB — plenty for task payloads

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let received = 0;
  for await (const chunk of req) {
    const buffer = chunk as Buffer;
    received += buffer.length;
    if (received > MAX_BODY_BYTES) throw payloadTooLarge(MAX_BODY_BYTES);
    chunks.push(buffer);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.trim() === '') return undefined;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw badRequest('Request body is not valid JSON');
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  if (body === undefined) {
    res.writeHead(status);
    res.end();
    return;
  }
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

/**
 * Builds the HTTP server around a TaskStore. Exported with an injectable
 * store so integration tests can run against a fresh instance per suite.
 */
export function createApp(store: TaskStore = new TaskStore()): Server {
  const router = createRouter(store);

  return createServer((req, res) => {
    void (async () => {
      try {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const body = await readBody(req);
        const response = router.handle({
          method: req.method ?? 'GET',
          path: url.pathname,
          query: url.searchParams,
          body,
        });
        sendJson(res, response.status, response.body);
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.allow) res.setHeader('allow', error.allow.join(', '));
          sendJson(res, error.status, {
            error: {
              code: error.code,
              message: error.message,
              ...(error.details ? { details: error.details } : {}),
            },
          });
          return;
        }
        console.error('Unhandled error:', error);
        sendJson(res, 500, {
          error: { code: 'internal_error', message: 'Something went wrong' },
        });
      }
    })();
  });
}
