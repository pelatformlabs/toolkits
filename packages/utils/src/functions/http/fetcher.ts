/**
 * Utility functions for data fetching
 * Provides enhanced fetch implementation with error handling for SWR
 */

import { isDevelopment } from "../../constants/development";

/**
 * Extended Error interface for SWR compatibility
 * Includes additional properties for error information and HTTP status
 */
interface SWRError extends Error {
  info: string | Record<string, unknown>;
  status: number;
}

/**
 * HTTP request methods supported by the `request` utility
 * Ensures type-safe method selection for fetch operations
 */
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Options for the `request` utility
 * Controls request headers and optional logging
 */
type RequestOptions = {
  /**
   * Custom headers to include in the request
   * When sending JSON, `Content-Type: application/json` is automatically added
   */
  headers?: Record<string, string>;
  /**
   * Whether to log the endpoint and response to console
   * Useful for debugging during development (default: false)
   */
  log?: boolean;
};

/**
 * Safely parses a JSON response body.
 *
 * This helper prevents runtime errors when attempting to parse
 * non-JSON responses (e.g. empty body, plain text, HTML error pages).
 *
 * @param res - Fetch Response object
 * @returns Parsed JSON object if available, otherwise `null`
 */
async function safeParseJSON(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Creates a standardized error object compatible with SWR.
 *
 * Attaches HTTP status code and additional error information
 * extracted from the response body.
 *
 * @param message - Error message or response payload
 * @param status - HTTP status code
 * @returns SWRError instance with enriched metadata
 */
function createFetchError(message: unknown, status: number): SWRError {
  const errorMessage = typeof message === "string" ? message : "Request failed";

  const error = new Error(errorMessage) as SWRError;

  error.info =
    typeof message === "string"
      ? message
      : message && typeof message === "object"
        ? (message as Record<string, unknown>)
        : "Unknown error";

  error.status = status;

  return error;
}

/**
 * Fetches data from an API endpoint with proper error handling
 * Designed to work seamlessly with SWR data fetching library
 *
 * @param input - The resource URL or Request object to fetch
 * @param init - Optional fetch initialization options with typed headers
 * @returns A Promise that resolves to the JSON response data
 * @throws SWRError with status code and error information on failure
 *
 * @example
 * ```ts
 * import { fetcher } from '@/utils/functions';
 * import useSWR from 'swr';
 *
 * // Basic usage with SWR
 * const { data, error } = useSWR('/api/user', fetcher);
 *
 * // With custom headers
 * const { data } = useSWR('/api/protected', url =>
 *   fetcher(url, {
 *     headers: {
 *       Authorization: `Bearer ${token}`
 *     }
 *   })
 * );
 *
 * // Direct usage without SWR
 * try {
 *   const data = await fetcher('/api/data');
 *   console.log(data);
 * } catch (error) {
 *   // Error will include status code and error info
 *   console.error(`Error ${error.status}: ${error.info}`);
 * }
 * ```
 */
export async function fetcher<T = unknown>(
  input: RequestInfo,
  init?: RequestInit & { headers?: Record<string, string> },
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
    },
  });

  const data = await safeParseJSON(res);

  if (!res.ok) {
    const errorPayload =
      typeof data === "object" && data !== null && "error" in data
        ? // biome-ignore lint/suspicious/noExplicitAny: <>
          ((data as any).error?.message ?? data)
        : (data ?? res.statusText);

    throw createFetchError(errorPayload, res.status);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return null as T;
  }

  return data as T;
}

/**
 * Performs an HTTP request with optional JSON or FormData payload
 * Automatically sets `Content-Type: application/json` for JSON bodies
 * Supports basic logging of endpoint and response data
 *
 * @param endpoint - The target URL to send the request to
 * @param method - HTTP method to use (default: `GET`)
 * @param body - Request payload; accepts plain objects or `FormData`
 * @param options - Additional request options like headers and logging
 * @returns A Promise resolving to parsed JSON response
 *
 * @example
 * ```ts
 * // GET request
 * const users = await request('/api/users');
 *
 * // POST JSON body
 * const created = await request('/api/users', 'POST', { name: 'Alice' });
 *
 * // PUT with custom header
 * const updated = await request('/api/users/1', 'PUT', { name: 'Bob' }, {
 *   headers: { Authorization: `Bearer ${token}` },
 * });
 *
 * // Multipart/FormData upload
 * const form = new FormData();
 * form.append('file', file);
 * const upload = await request('/api/upload', 'POST', form);
 * ```
 */
export async function request<T = unknown>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers: Record<string, string> = {
    ...options?.headers,
  };

  let payload: BodyInit | undefined;

  if (body !== undefined) {
    if (isFormData) {
      payload = body as FormData;
    } else {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(endpoint, {
    method,
    headers,
    body: payload,
  });

  const data = await safeParseJSON(res);

  if (!res.ok) {
    const errorPayload =
      typeof data === "object" && data !== null && "error" in data
        ? // biome-ignore lint/suspicious/noExplicitAny: <>
          ((data as any).error?.message ?? data)
        : (data ?? res.statusText);

    throw createFetchError(errorPayload, res.status);
  }

  if (options?.log && isDevelopment) {
    console.log(`[request] ${endpoint}`, data);
  }

  return data as T;
}
