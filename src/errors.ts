export interface ValidationIssue {
  field: string;
  message: string;
}

/**
 * Structured API error. Anything thrown as an ApiError is serialized to the
 * client as `{ error: { code, message, details? } }` with its HTTP status;
 * anything else becomes an opaque 500.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ValidationIssue[];
  /** Allowed methods, set for 405 responses (becomes the Allow header). */
  readonly allow?: string[];

  constructor(
    status: number,
    code: string,
    message: string,
    options: { details?: ValidationIssue[]; allow?: string[] } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    if (options.details) this.details = options.details;
    if (options.allow) this.allow = options.allow;
  }
}

export function badRequest(message: string, details?: ValidationIssue[]): ApiError {
  return new ApiError(400, 'bad_request', message, details ? { details } : {});
}

export function notFound(message: string): ApiError {
  return new ApiError(404, 'not_found', message);
}

export function methodNotAllowed(allow: string[]): ApiError {
  return new ApiError(405, 'method_not_allowed', `Allowed methods: ${allow.join(', ')}`, { allow });
}

export function payloadTooLarge(limitBytes: number): ApiError {
  return new ApiError(413, 'payload_too_large', `Request body exceeds ${limitBytes} bytes`);
}
