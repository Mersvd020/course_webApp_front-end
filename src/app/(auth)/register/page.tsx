import AuthPageHeader from '@/components/auth/authPageHeader';
import CourseRegisterForm from '@/components/auth/CourseRegisterForm';

export default function RegisterPage() {
  return <div className="flex flex-col items-center gap-5 w-full"><AuthPageHeader head="ثبت‌نام در رویش" /><CourseRegisterForm /></div>;
}
