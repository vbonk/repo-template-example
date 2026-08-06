import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createApp } from '../../src/server.js';
import type { Task } from '../../src/types.js';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

async function createTask(payload: unknown): Promise<Task> {
  const res = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  expect(res.status).toBe(201);
  return (await res.json()) as Task;
}

describe('task-api over real HTTP', () => {
  it('answers the health check', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('creates, fetches, updates, and deletes a task', async () => {
    const created = await createTask({ title: 'Full lifecycle', status: 'in_progress' });
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created.status).toBe('in_progress');

    const fetched = await fetch(`${baseUrl}/tasks/${created.id}`);
    expect(fetched.status).toBe(200);
    expect(await fetched.json()).toEqual(created);

    const patched = await fetch(`${baseUrl}/tasks/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'done', description: 'wrapped up' }),
    });
    expect(patched.status).toBe(200);
    const updated = (await patched.json()) as Task;
    expect(updated.status).toBe('done');
    expect(updated.description).toBe('wrapped up');
    expect(updated.title).toBe('Full lifecycle');

    const deleted = await fetch(`${baseUrl}/tasks/${created.id}`, { method: 'DELETE' });
    expect(deleted.status).toBe(204);

    const gone = await fetch(`${baseUrl}/tasks/${created.id}`);
    expect(gone.status).toBe(404);
    const body = (await gone.json()) as { error: { code: string } };
    expect(body.error.code).toBe('not_found');
  });

  it('lists tasks and filters by status', async () => {
    await createTask({ title: 'Filter target', status: 'done' });
    const all = await fetch(`${baseUrl}/tasks`);
    expect(all.status).toBe(200);
    const { tasks } = (await all.json()) as { tasks: Task[] };
    expect(tasks.length).toBeGreaterThan(0);

    const done = await fetch(`${baseUrl}/tasks?status=done`);
    const doneBody = (await done.json()) as { tasks: Task[] };
    expect(doneBody.tasks.every((task) => task.status === 'done')).toBe(true);
  });

  it('rejects an invalid status filter', async () => {
    const res = await fetch(`${baseUrl}/tasks?status=bogus`);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { details: unknown[] } };
    expect(body.error.details).toHaveLength(1);
  });

  it('rejects invalid create payloads with per-field issues', async () => {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ description: 'no title' }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as {
      error: { code: string; details: { field: string }[] };
    };
    expect(body.error.code).toBe('bad_request');
    expect(body.error.details[0]?.field).toBe('title');
  });

  it('rejects bodies that are not valid JSON', async () => {
    const res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { message: string } };
    expect(body.error.message).toBe('Request body is not valid JSON');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await fetch(`${baseUrl}/nope`);
    expect(res.status).toBe(404);
  });

  it('returns 405 with an Allow header for wrong methods', async () => {
    const res = await fetch(`${baseUrl}/tasks`, { method: 'PUT' });
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('GET, POST');

    const health = await fetch(`${baseUrl}/health`, { method: 'POST' });
    expect(health.status).toBe(405);
    expect(health.headers.get('allow')).toBe('GET');
  });
});
