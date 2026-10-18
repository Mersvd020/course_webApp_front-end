'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { recoverCoursePassword, resetCoursePassword } from '@/util/service/course-platform/auth-actions';
import { initialAuthState } from '@/util/service/course-platform/auth-state';
import CourseAuthField from './CourseAuthField';

function ResetForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resetCoursePassword, initialAuthState);
  if (state.success) return <div className="auth-form-success" role="status"><p>{state.message}</p><Link className="button button-primary" href="/login">ورود با رمز جدید</Link></div>;
  return <form action={action} className="flex flex-col gap-5 w-full"><p className="auth-email-note">کد ارسال‌شده به <b dir="ltr">{email}</b> و رمز جدید را وارد کنید.</p><input type="hidden" name="email" value={email} /><CourseAuthField name="otpCode" label="کد تأیید ایمیل" autoComplete="one-time-code" inputMode="numeric" errors={state.errors?.otpCode} /><CourseAuthField name="password" label="رمز عبور جدید" type="password" autoComplete="new-password" errors={state.errors?.password} /><CourseAuthField name="passwordRepeat" label="تکرار رمز عبور جدید" type="password" autoComplete="new-password" errors={state.errors?.passwordRepeat} />{state.message && <p role="alert" className="auth-field-error">{state.message}</p>}<button type="submit" disabled={pending} className="button button-primary">{pending ? 'در حال تغییر رمز…' : 'تأیید کد و تغییر رمز عبور'}</button></form>;
}

export default function CourseRecoveryForm() {
  const [state, action, pending] = useActionState(recoverCoursePassword, initialAuthState);
  const [email, setEmail] = useState('');
  if (state.success) return <ResetForm email={email} />;
  return <form action={action} onSubmit={event => setEmail(String(new FormData(event.currentTarget).get('email') ?? '').trim())} className="flex flex-col gap-5 w-full"><CourseAuthField name="email" label="ایمیل حساب کاربری" type="email" autoComplete="email" errors={state.errors?.email} />{state.message && <p role="alert" className="auth-field-error">{state.message}</p>}<button type="submit" className="button button-primary" disabled={pending}>{pending ? 'در حال ارسال…' : 'دریافت کد بازیابی'}</button><div className="auth-form-links"><Link href="/login">بازگشت به ورود</Link></div></form>;
}
