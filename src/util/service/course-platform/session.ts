import 'server-only';

import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import { CoursePlatformError, isRecord } from './client';

const accessCookie = 'course_access_token';
const refreshCookie = 'course_refresh_token';
const deviceCookie = 'course_device_id';
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };

// Only this function needs adjustment if the login response uses different token keys.
export function parseLoginTokens(payload: unknown): { accessToken: string; refreshToken?: string } {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;
  if (!isRecord(data) || typeof data.accessToken !== 'string' || !data.accessToken) {
    throw new CoursePlatformError('پاسخ ورود معتبر نیست؛ توکن دسترسی دریافت نشد.', 502);
  }
  return { accessToken: data.accessToken, refreshToken: typeof data.refreshToken === 'string' ? data.refreshToken : undefined };
}

export async function getCourseAccessToken() {
  return (await cookies()).get(accessCookie)?.value ?? null;
}

export async function getOrCreateDeviceId() {
  const store = await cookies();
  const current = store.get(deviceCookie)?.value;
  if (current && /^[a-zA-Z0-9-]{1,100}$/.test(current)) return current;
  const deviceId = randomUUID();
  store.set(deviceCookie, deviceId, { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  return deviceId;
}

function accessTokenLifetime(token: string) {
  try {
    const payload: unknown = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    if (isRecord(payload) && typeof payload.exp === 'number' && Number.isFinite(payload.exp)) {
      return Math.max(0, Math.min(60 * 60 * 24, Math.floor(payload.exp - Date.now() / 1000)));
    }
  } catch { /* Opaque tokens use a bounded cookie lifetime. */ }
  return 60 * 60;
}

export async function saveCourseSession(tokens: { accessToken: string; refreshToken?: string }) {
  const store = await cookies();
  store.set(accessCookie, tokens.accessToken, { ...cookieOptions, maxAge: accessTokenLifetime(tokens.accessToken) });
  if (tokens.refreshToken) store.set(refreshCookie, tokens.refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
  else store.delete(refreshCookie);
}

export async function clearCourseSession() {
  const store = await cookies();
  store.delete(accessCookie);
  store.delete(refreshCookie);
}
