'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginCourseAccount } from '@/util/service/course-platform/auth-actions';
import { initialAuthState } from '@/util/service/course-platform/auth-state';
import CourseAuthField from '@/components/auth/CourseAuthField';

export default function LoginHandler() {
  const [state, action, pending] = useActionState(loginCourseAccount, initialAuthState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) { router.replace('/home'); router.refresh(); }
  }, [state.success, router]);

  return <form action={action} className="flex flex-col gap-5 w-full">
    <CourseAuthField name="email" type="email" label="ایمیل" autoComplete="email" errors={state.errors?.email} />
    <CourseAuthField name="password" type="password" label="رمز عبور" autoComplete="current-password" errors={state.errors?.password} />
    <Link href="/forgetPassword" className="auth-forgot-link">رمز عبورت را فراموش کردی؟</Link>
    {state.message && <p className={state.success ? 'auth-form-success' : 'auth-field-error'} role={state.success ? 'status' : 'alert'}>{state.message}</p>}
    <button type="submit" className="button button-primary" disabled={pending || state.success}>{pending ? 'در حال ورود…' : 'ورود به حساب رویش'}</button>
    <div className="auth-form-links"><span>هنوز عضو رویش نیستی؟</span><Link href="/register">ساخت حساب کاربری</Link></div>
  </form>;
}
