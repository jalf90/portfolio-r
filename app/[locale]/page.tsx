import Avatar from '@/components/Avatar';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <h2>{t('title')}</h2>
      <Avatar src="/assets/images/profile.png" height={70} width={70} />
    </div>
  );
}
