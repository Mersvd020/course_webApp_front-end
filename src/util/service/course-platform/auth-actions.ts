'use server';

import { z } from 'zod';
import { CoursePlatformError } from './client';
import { requestLogin, requestRegistration, requestPasswordRecovery, requestPasswordReset } from './api';
import type { AuthFormState } from './auth-state';
import { clearCourseSession, getOrCreateDeviceId, parseLoginTokens, saveCourseSession } from './session';
import { redirect } from 'next/navigation';

const email = z.email('ایمیل معتبر وارد کنید.').trim();
const password = z.string().min(1, 'رمز عبور را وارد کنید.');
const registrationSchema = z.object({
  email,
  phoneNumber: z.string().trim().regex(/^09\d{9}$/, 'شماره موبایل را با قالب ۰۹ و ۱۱ رقم وارد کنید.'),
  password,
  passwordRepeat: password,
}).refine(value => value.password === value.passwordRepeat, {
  path: ['passwordRepeat'], message: 'تکرار رمز عبور یکسان نیست.',
});
const recoverySchema = z.object({ email });
const resetSchema = z.object({
  email,
  otpCode: z.string().trim().min(1, 'کد تأیید را وارد کنید.'),
  password,
  passwordRepeat: password,
}).refine(value => value.password === value.passwordRepeat, {
  path: ['passwordRepeat'], message: 'تکرار رمز عبور یکسان نیست.',
});

function errorState(error: unknown): AuthFormState {
  return { success: false, message: error instanceof CoursePlatformError ? error.message : 'درخواست انجام نشد. دوباره تلاش کنید.' };
}

export async function loginCourseAccount(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const result = z.object({ email, password }).safeParse(Object.fromEntries(form));
  if (!result.success) return { success: false, message: '', errors: z.flattenError(result.error).fieldErrors };
  try {
    const response = await requestLogin(result.data, await getOrCreateDeviceId());
    await saveCourseSession(parseLoginTokens(response));
    return { success: true, message: 'با موفقیت وارد حساب رویش شدید.' };
  } catch (error) { return errorState(error); }
}

export async function logoutCourseAccount(): Promise<void> {
  await clearCourseSession();
  redirect('/login');
}

export async function registerCourseAccount(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const result = registrationSchema.safeParse(Object.fromEntries(form));
  if (!result.success) return { success: false, message: '', errors: z.flattenError(result.error).fieldErrors };
  try {
    const { email, phoneNumber, password } = result.data;
    await requestRegistration({ email, phoneNumber, password });
    return { success: true, message: 'حساب شما ساخته شد. اکنون می‌توانید وارد شوید.' };
  } catch (error) { return errorState(error); }
}

export async function recoverCoursePassword(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const result = recoverySchema.safeParse(Object.fromEntries(form));
  if (!result.success) return { success: false, message: '', errors: z.flattenError(result.error).fieldErrors };
  try {
    await requestPasswordRecovery(result.data.email);
    return { success: true, message: 'درخواست ارسال کد ثبت شد. ایمیل خود را بررسی کنید.' };
  } catch (error) { return errorState(error); }
}

export async function resetCoursePassword(_previous: AuthFormState, form: FormData): Promise<AuthFormState> {
  const result = resetSchema.safeParse(Object.fromEntries(form));
  if (!result.success) return { success: false, message: '', errors: z.flattenError(result.error).fieldErrors };
  try {
    const { email, otpCode, password } = result.data;
    await requestPasswordReset({ email, otpCode, password });
    return { success: true, message: 'رمز عبور تغییر کرد. با رمز جدید وارد شوید.' };
  } catch (error) { return errorState(error); }
}
