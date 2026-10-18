import HeaderComponent from '@/components/common/Header/Header';
import FooterComponent from '@/components/common/Footer/Footer';
import CourseShell from '@/components/courses/CourseShell';
import { getToken } from '@/util/service/api/token';
import { getCourseAccessToken } from '@/util/service/course-platform/session';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const token = await getToken();
  const courseToken = await getCourseAccessToken();
  return <CourseShell signedIn={Boolean(courseToken)} legacyHeader={<HeaderComponent token={token} />} legacyFooter={<FooterComponent />}>{children}</CourseShell>;
}
