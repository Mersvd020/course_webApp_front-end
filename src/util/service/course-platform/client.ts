import 'server-only';

export class CoursePlatformError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: unknown) {
    super(message);
    this.name = 'CoursePlatformError';
  }
}

export function getCoursePlatformBaseUrl(): string {
  const configured = process.env.COURSE_API_URL?.trim();
  if (!configured) {
    throw new CoursePlatformError('آدرس سرور دوره‌ها تنظیم نشده است.', 503);
  }
  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new CoursePlatformError('آدرس سرور دوره‌ها معتبر نیست.', 503);
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new CoursePlatformError('آدرس سرور دوره‌ها معتبر نیست.', 503);
  }
  return url.toString().replace(/\/$/, '');
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  token?: string;
  deviceId?: string;
};

export async function coursePlatformRequest(path: string, options: RequestOptions = {}): Promise<unknown> {
  const baseUrl = getCoursePlatformBaseUrl();
  const headers = new Headers({ Accept: 'application/json' });
  if (options.body) headers.set('Content-Type', 'application/json');
  if (options.token) headers.set('Authorization', `Bearer ${options.token}`);
  if (options.deviceId) headers.set('x-device-id', options.deviceId);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    });
  } catch {
    throw new CoursePlatformError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.', 503);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try { payload = JSON.parse(text); }
    catch { throw new CoursePlatformError('پاسخ سرور در قالب JSON نیست.', response.ok ? 502 : response.status); }
  }
  const payloadStatus = isRecord(payload) && typeof payload.status === 'number' ? payload.status : response.status;
  if (!response.ok || payloadStatus >= 400 || (isRecord(payload) && payload.success === false)) {
    const message = isRecord(payload) && typeof payload.message === 'string'
      ? payload.message
      : response.status === 401 ? 'برای ادامه وارد حساب خود شوید.'
      : response.status === 403 ? 'دسترسی به این بخش مجاز نیست.'
      : 'درخواست انجام نشد. دوباره تلاش کنید.';
    throw new CoursePlatformError(message, response.ok ? Math.max(400, payloadStatus) : response.status, payload);
  }
  return payload;
}
