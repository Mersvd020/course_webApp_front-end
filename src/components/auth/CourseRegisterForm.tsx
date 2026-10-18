'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerCourseAccount } from '@/util/service/course-platform/auth-actions';
import { initialAuthState } from '@/util/service/course-platform/auth-state';
import CourseAuthField from './CourseAuthField';

export default function CourseRegisterForm() {
  const [state, action, pending] = useActionState(registerCourseAccount, initialAuthState);
  if (state.success) return <div className="auth-form-success" role="status"><p>{state.message}</p><Link className="button button-primary" href="/login">ورود به حساب رویش</Link></div>;
  return <form action={action} className="flex flex-col gap-5 w-full">
    <CourseAuthField name="email" label="ایمیل" type="email" autoComplete="email" errors={state.errors?.email} />
    <CourseAuthField name="phoneNumber" label="شماره موبایل" type="tel" autoComplete="tel" errors={state.errors?.phoneNumber} />
    <CourseAuthField name="password" label="رمز عبور" type="password" autoComplete="new-password" errors={state.errors?.password} />
    <CourseAuthField name="passwordRepeat" label="تکرار رمز عبور" type="password" autoComplete="new-password" errors={state.errors?.passwordRepeat} />
    {state.message && <p className="auth-field-error" role="alert">{state.message}</p>}
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? 'در حال ساخت حساب…' : 'ساخت حساب رویش'}</button>
    <div className="auth-form-links"><span>قبلاً حساب ساخته‌ای؟</span><Link href="/login">ورود به حساب</Link></div>
  </form>;
}
