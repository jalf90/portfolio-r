import Avatar from '@/components/Avatar';
import { getTranslations } from 'next-intl/server';
import styles from './page.module.scss';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <div className={styles.main}>
      <Avatar src="/assets/images/profile.png" height={70} width={70} />
      <label>{t('welcome.hello')}</label>
      <h2>{t('welcome.title')}</h2>
      <h2>{t('welcome.subtitle')}</h2>
    </div>
  );
}
