import AuthPageHeader from '@/components/auth/authPageHeader';
import CourseRecoveryForm from '@/components/auth/CourseRecoveryForm';

export default function PasswordRecoveryPage() {
  return <div className="flex flex-col items-center gap-5 w-full"><AuthPageHeader head="بازیابی رمز عبور" step="FverifyEmail" /><CourseRecoveryForm /></div>;
}
