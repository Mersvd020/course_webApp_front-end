import { redirect } from 'next/navigation';

export default async function LegacyDetailPage({ params }: { params: Promise<{ houseId: string }> }) {
  const { houseId } = await params;
  redirect(/^[0-9a-f-]{36}$/i.test(houseId) ? `/courses/${houseId}` : '/courses');
}
