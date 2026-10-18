import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Sparkles } from 'lucide-react';
import '@/components/courses/courses.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="academy-auth" dir="rtl"><section className="auth-form-column"><Link className="auth-back" href="/home"><ArrowRight size={15} />بازگشت به رویش</Link>{children}</section><aside className="auth-art-column"><div className="auth-art"><span className="auth-art-icon"><BookOpen size={30} /></span><span className="eyebrow" style={{ marginTop: 35 }}><Sparkles size={15} />فصل تازه‌ای از مسیر تو</span><h2>هر مهارت تازه،<br /><span>یک شروع تازه است.</span></h2><p>وارد دنیای یادگیری رویش شو. دوره مناسب خودت را پیدا کن، تمرین کن و قدم‌به‌قدم آینده‌ات را بساز.</p><div className="auth-art-steps"><span><Check size={14} />آموزش کاربردی</span><span><Check size={14} />یادگیری با تمرین</span><span><Check size={14} />رشد مداوم</span></div><span className="auth-art-spark" aria-hidden="true">✳</span></div></aside></main>;
}
