import { randomUUID } from 'node:crypto';
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from './types.js';

/**
 * In-memory task storage. Deliberately service-free (see ADR-006) — a real
 * project would put a database behind this same interface.
 */
export class TaskStore {
  readonly #tasks = new Map<string, Task>();

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      status: input.status ?? 'todo',
      createdAt: now,
      updatedAt: now,
      ...(input.description !== undefined ? { description: input.description } : {}),
    };
    this.#tasks.set(task.id, task);
    return task;
  }

  get(id: string): Task | undefined {
    return this.#tasks.get(id);
  }

  list(status?: TaskStatus): Task[] {
    const all = [...this.#tasks.values()];
    return status === undefined ? all : all.filter((task) => task.status === status);
  }

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const existing = this.#tasks.get(id);
    if (!existing) return undefined;
    const updated: Task = {
      ...existing,
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      updatedAt: new Date().toISOString(),
    };
    this.#tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.#tasks.delete(id);
  }
}
