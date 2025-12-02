const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) ||
  (globalThis as any).VITE_API_BASE_URL ||
  'http://localhost:8082';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const contentType = resp.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await resp.json() : await resp.text();
  if (!resp.ok) {
    const message = isJson && body && (body.message || body.error || body.code) ?
      `${body.code ? body.code + ': ' : ''}${body.message || body.error}` :
      `HTTP ${resp.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function postJson<TReq, TRes>(path: string, payload: TReq): Promise<TRes> {
  return apiRequest<TRes>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
