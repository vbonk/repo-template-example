import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/errors.js';
import { parseCreateTask, parseUpdateTask } from '../../src/validation.js';

function catchApiError(fn: () => unknown): ApiError {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    return error as ApiError;
  }
  throw new Error('expected an ApiError to be thrown');
}

describe('parseCreateTask', () => {
  it('accepts a full payload', () => {
    const input = parseCreateTask({
      title: 'Write docs',
      description: 'Fill in ARCHITECTURE.md',
      status: 'in_progress',
    });
    expect(input).toEqual({
      title: 'Write docs',
      description: 'Fill in ARCHITECTURE.md',
      status: 'in_progress',
    });
  });

  it('accepts a minimal payload and trims the title', () => {
    expect(parseCreateTask({ title: '  Ship it  ' })).toEqual({ title: 'Ship it' });
  });

  it('rejects a missing title', () => {
    const error = catchApiError(() => parseCreateTask({}));
    expect(error.status).toBe(400);
    expect(error.details).toEqual([{ field: 'title', message: 'is required' }]);
  });

  it('rejects an empty or non-string title', () => {
    for (const title of ['', '   ', 42, null]) {
      const error = catchApiError(() => parseCreateTask({ title }));
      expect(error.details?.[0]?.field).toBe('title');
    }
  });

  it('rejects an overlong title', () => {
    const error = catchApiError(() => parseCreateTask({ title: 'x'.repeat(201) }));
    expect(error.details?.[0]?.message).toContain('200');
  });

  it('rejects an invalid status and reports valid options', () => {
    const error = catchApiError(() => parseCreateTask({ title: 'ok', status: 'later' }));
    expect(error.details?.[0]).toEqual({
      field: 'status',
      message: 'must be one of: todo, in_progress, done',
    });
  });

  it('rejects unknown fields', () => {
    const error = catchApiError(() => parseCreateTask({ title: 'ok', priority: 'high' }));
    expect(error.details).toEqual([{ field: 'priority', message: 'unknown field' }]);
  });

  it('rejects non-object bodies', () => {
    for (const body of [undefined, null, 'title', 7, ['title']]) {
      const error = catchApiError(() => parseCreateTask(body));
      expect(error.status).toBe(400);
      expect(error.message).toBe('Request body must be a JSON object');
    }
  });

  it('rejects a non-string description', () => {
    const error = catchApiError(() => parseCreateTask({ title: 'ok', description: 9 }));
    expect(error.details?.[0]?.field).toBe('description');
  });

  it('rejects an overlong description', () => {
    const error = catchApiError(() =>
      parseCreateTask({ title: 'ok', description: 'x'.repeat(2001) }),
    );
    expect(error.details?.[0]?.message).toContain('2000');
  });
});

describe('parseUpdateTask', () => {
  it('accepts a partial payload', () => {
    expect(parseUpdateTask({ status: 'done' })).toEqual({ status: 'done' });
  });

  it('accepts multiple fields and trims the title', () => {
    expect(parseUpdateTask({ title: ' New name ', description: 'why' })).toEqual({
      title: 'New name',
      description: 'why',
    });
  });

  it('rejects an empty payload', () => {
    const error = catchApiError(() => parseUpdateTask({}));
    expect(error.message).toBe('Update payload must set at least one field');
  });

  it('rejects invalid fields with per-field issues', () => {
    const error = catchApiError(() => parseUpdateTask({ title: '', status: 'nope' }));
    expect(error.details?.map((issue) => issue.field)).toEqual(['title', 'status']);
  });

  it('rejects non-object bodies', () => {
    const error = catchApiError(() => parseUpdateTask('done'));
    expect(error.status).toBe(400);
  });
});
