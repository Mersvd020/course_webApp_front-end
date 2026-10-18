import 'server-only';
import { coursePlatformRequest } from './client';

// Request contracts taken from course_platform_API.postman_collection.json.
export type CourseListParams = {
  search?: string;
  limit?: number;
  page?: number;
  sortType?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
};

export function requestCourseList(params: CourseListParams = {}, token?: string) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  return coursePlatformRequest(`/course/getAllCourseWithPagination${query.size ? `?${query}` : ''}`, { token });
}

export function requestCourse(id: string, token?: string) {
  return coursePlatformRequest(`/course/${encodeURIComponent(id)}`, { token });
}

export function requestCourseTopics(id: string, token?: string) {
  return coursePlatformRequest(`/course/${encodeURIComponent(id)}/topics`, { token });
}

export function requestCategories(token?: string) {
  return coursePlatformRequest('/course/getAllcategories', { token });
}

export function requestLogin(data: { email: string; password: string }, deviceId: string) {
  return coursePlatformRequest('/user/login', { method: 'POST', body: data, deviceId });
}

export function requestRegistration(data: { email: string; phoneNumber: string; password: string }) {
  return coursePlatformRequest('/user/register', { method: 'POST', body: data });
}

export function requestPasswordRecovery(email: string) {
  return coursePlatformRequest('/user/step1_forgetPassword', { method: 'POST', body: { email } });
}

export function requestPasswordReset(data: { email: string; otpCode: string; password: string }) {
  return coursePlatformRequest('/user/step2_resetPassword', { method: 'POST', body: data });
}

export function requestTokenRefresh(refreshToken: string, deviceId: string) {
  return coursePlatformRequest('/user/refreshToken', { method: 'POST', body: { refreshToken }, deviceId });
}
