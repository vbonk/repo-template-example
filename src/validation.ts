import { badRequest } from './errors.js';
import type { ValidationIssue } from './errors.js';
import { TASK_STATUSES, isTaskStatus } from './types.js';
import type { CreateTaskInput, UpdateTaskInput } from './types.js';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;
const KNOWN_FIELDS = ['title', 'description', 'status'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function collectFieldIssues(body: Record<string, unknown>, issues: ValidationIssue[]): void {
  for (const key of Object.keys(body)) {
    if (!(KNOWN_FIELDS as readonly string[]).includes(key)) {
      issues.push({ field: key, message: 'unknown field' });
    }
  }
  if ('title' in body) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      issues.push({ field: 'title', message: 'must be a non-empty string' });
    } else if (body.title.length > TITLE_MAX) {
      issues.push({ field: 'title', message: `must be at most ${TITLE_MAX} characters` });
    }
  }
  if ('description' in body) {
    if (typeof body.description !== 'string') {
      issues.push({ field: 'description', message: 'must be a string' });
    } else if (body.description.length > DESCRIPTION_MAX) {
      issues.push({ field: 'description', message: `must be at most ${DESCRIPTION_MAX} characters` });
    }
  }
  if ('status' in body && !isTaskStatus(body.status)) {
    issues.push({ field: 'status', message: `must be one of: ${TASK_STATUSES.join(', ')}` });
  }
}

export function parseCreateTask(body: unknown): CreateTaskInput {
  if (!isRecord(body)) {
    throw badRequest('Request body must be a JSON object');
  }
  const issues: ValidationIssue[] = [];
  if (!('title' in body)) {
    issues.push({ field: 'title', message: 'is required' });
  }
  collectFieldIssues(body, issues);
  if (issues.length > 0) {
    throw badRequest('Invalid task payload', issues);
  }
  const input: CreateTaskInput = { title: (body.title as string).trim() };
  if (typeof body.description === 'string') input.description = body.description;
  if (isTaskStatus(body.status)) input.status = body.status;
  return input;
}

export function parseUpdateTask(body: unknown): UpdateTaskInput {
  if (!isRecord(body)) {
    throw badRequest('Request body must be a JSON object');
  }
  if (Object.keys(body).length === 0) {
    throw badRequest('Update payload must set at least one field', [
      ...KNOWN_FIELDS.map((field) => ({ field, message: 'may be provided' })),
    ]);
  }
  const issues: ValidationIssue[] = [];
  collectFieldIssues(body, issues);
  if (issues.length > 0) {
    throw badRequest('Invalid task payload', issues);
  }
  const input: UpdateTaskInput = {};
  if (typeof body.title === 'string') input.title = body.title.trim();
  if (typeof body.description === 'string') input.description = body.description;
  if (isTaskStatus(body.status)) input.status = body.status;
  return input;
}
