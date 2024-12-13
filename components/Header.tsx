import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.navbar}>
      <div>Logo</div>
      <nav></nav>
      <div className="flex">
        hello
        <Link href="/home" locale="en-US">
          English
        </Link>
        <Link href="/home" locale="fr">
          Français
        </Link>
      </div>
    </header>
  );
}
