import Link from 'next/link';
import { CourseBrand } from '@/components/courses/CourseShell';

interface Props {
  step?: 'RverifyEmail' | 'RverifyCode' | 'FverifyEmail' | 'FverifyCode' | 'resetPass' | 'registerFinal';
  head: string;
  email?: string;
}

export default function AuthPageHeader({ step, head, email }: Props) {
  const verification = step === 'RverifyCode' || step === 'FverifyCode';
  return <header className="my-2 w-full"><CourseBrand /><h1 className="font-bold text-[30px] mb-5">{head}</h1><p className="text-[14px] font-medium text-[#767676]">
    {verification ? <>کد تأیید ارسال‌شده به <b dir="ltr">{email}</b> را وارد کن.</> : step === 'registerFinal' ? 'برای تکمیل حساب یادگیری، اطلاعات زیر را وارد کن.' : step === 'resetPass' ? 'یک رمز عبور جدید برای حساب خود انتخاب کن.' : step === 'FverifyEmail' ? 'ایمیل حسابت را وارد کن تا مسیر بازیابی رمز را شروع کنیم.' : head.includes('ثبت') ? 'حساب رویش خودت را بساز و اولین قدم یادگیری را بردار.' : 'خوش برگشتی! وارد حسابت شو و مسیر یادگیری را ادامه بده.'}
    {verification && <><br /><Link className="underline text-[#7552d8]" href={step === 'RverifyCode' ? '/register' : '/forgetPassword'}>ویرایش ایمیل</Link></>}
  </p></header>;
}
