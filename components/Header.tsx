import { Link } from '@/i18n/routing';
import styles from './Header.module.scss';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  return (
    <header className={styles.navbar}>
      <div>Logo</div>
      <Link href="/">Home</Link>
      <Link href="/contact">Contact me</Link>
      <LocaleSwitcher />
      <nav></nav>
      <div className="flex">
        <Link href="/" locale="en">
          English
        </Link>
        <Link href="/" locale="fr">
          Français
        </Link>
      </div>
    </header>
  );
}
