// src/lib/errors.ts
export function extractApiMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    // axios style: err.response?.data?.message
    const maybeResponse = (err as { response?: { data?: { message?: unknown } } }).response;
    if (maybeResponse && maybeResponse.data && maybeResponse.data.message) {
      return String(maybeResponse.data.message);
    }
    if (err instanceof Error) return err.message;
  }
  return 'Request failed';
}
