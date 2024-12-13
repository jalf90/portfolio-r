import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
    </div>
  );
}
