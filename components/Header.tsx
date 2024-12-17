import { Link } from '@/i18n/routing';
import styles from './Header.module.scss';
import LocaleSwitcher from './LocaleSwitcher';
import { FaHome } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';
import { getTranslations } from 'next-intl/server';
import { TiWeatherPartlySunny } from 'react-icons/ti';

export default async function Header() {
  const t = await getTranslations('common');
  return (
    <header className={styles.navbar}>
      <nav className={styles.flatMenu}>
        <Link href="/" title={t('home')}>
          <FaHome size={20} />
        </Link>
        <Link href="/contact" title={t('contactme')}>
          <MdContactMail size={20} />
        </Link>
        <Link href="/weather" title={t('weather')}>
          <TiWeatherPartlySunny size={20} />
        </Link>
      </nav>
      <LocaleSwitcher />
    </header>
  );
}
