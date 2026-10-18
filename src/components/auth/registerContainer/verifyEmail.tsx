'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import Input from '@/components/common/inputFeild/input';
import { register_Request } from '@/util/service/authAction/action';
import { actionResult } from '@/util/service/authAction/actionResult';
import toast_errorHandling from '@/util/hooks/errorHandling';

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [state, formAction, pending] = useActionState(register_Request, actionResult);
  const router = useRouter();

  useEffect(() => {
    if (state?.status) toast_errorHandling(Number(state.status));
    if (state.success && state.data?.tempUserId) {
      const params = new URLSearchParams({ step: 'RverifyCode', email, tempUserId: String(state.data.tempUserId) });
      router.push(`/register?${params}`);
    }
  }, [state, email, router]);

  return <form action={formAction} className="flex flex-col gap-5 w-full">
    <Input setEmail={setEmail} email={email} type="text" name="email" placeHolder="ایمیل خود را وارد کن" label="ایمیل" icon="email" errors={state?.errors?.email} />
    <p className="auth-email-note">برای تأیید حساب، یک کد به ایمیلت ارسال می‌شود.</p>
    <button type="submit" className="button button-primary" disabled={pending}>{pending ? 'در حال ارسال کد…' : 'ساخت حساب و دریافت کد تأیید'}</button>
    <div className="auth-form-links"><span>قبلاً حساب ساخته‌ای؟</span><Link href="/login">ورود به حساب</Link></div>
  </form>;
}
