import { Link } from '@/i18n/routing';
import styles from './Header.module.scss';
import LocaleSwitcher from './LocaleSwitcher';
import { FaHome } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';
import { getTranslations } from 'next-intl/server';

export default async function Header() {
  const t = await getTranslations('common');
  return (
    <header className={styles.navbar}>
      <nav>
        <Link href="/" title={t('home')}>
          <FaHome size={20} />
        </Link>
        <Link href="/contact" title={t('contactme')}>
          <MdContactMail size={20} />
        </Link>
      </nav>
      <LocaleSwitcher />
    </header>
  );
}
