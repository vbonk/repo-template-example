import { beforeEach, describe, expect, it } from 'vitest';
import { TaskStore } from '../../src/store.js';

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    store = new TaskStore();
  });

  it('creates tasks with defaults and unique ids', () => {
    const a = store.create({ title: 'First' });
    const b = store.create({ title: 'Second' });
    expect(a.status).toBe('todo');
    expect(a.description).toBeUndefined();
    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBe(a.updatedAt);
  });

  it('honors explicit status and description on create', () => {
    const task = store.create({ title: 'T', description: 'D', status: 'done' });
    expect(task.status).toBe('done');
    expect(task.description).toBe('D');
  });

  it('gets a task by id and returns undefined for unknown ids', () => {
    const task = store.create({ title: 'Find me' });
    expect(store.get(task.id)).toEqual(task);
    expect(store.get('missing')).toBeUndefined();
  });

  it('lists all tasks and filters by status', () => {
    store.create({ title: 'A' });
    store.create({ title: 'B', status: 'done' });
    store.create({ title: 'C', status: 'done' });
    expect(store.list()).toHaveLength(3);
    expect(store.list('done')).toHaveLength(2);
    expect(store.list('in_progress')).toHaveLength(0);
  });

  it('updates only the provided fields and bumps updatedAt', () => {
    const task = store.create({ title: 'Original', description: 'keep me' });
    const updated = store.update(task.id, { status: 'in_progress' });
    expect(updated?.title).toBe('Original');
    expect(updated?.description).toBe('keep me');
    expect(updated?.status).toBe('in_progress');
    expect(updated?.createdAt).toBe(task.createdAt);
    expect(Date.parse(updated?.updatedAt ?? '')).toBeGreaterThanOrEqual(
      Date.parse(task.updatedAt),
    );
  });

  it('returns undefined when updating a missing task', () => {
    expect(store.update('missing', { title: 'nope' })).toBeUndefined();
  });

  it('deletes tasks and reports whether anything was deleted', () => {
    const task = store.create({ title: 'Temporary' });
    expect(store.delete(task.id)).toBe(true);
    expect(store.get(task.id)).toBeUndefined();
    expect(store.delete(task.id)).toBe(false);
  });
});
