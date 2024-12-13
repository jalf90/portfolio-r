import Image from 'next/image';
import styles from './Avatar.module.scss';

interface AvatarProps {
  url?: string;
  height?: number;
  width?: number;
}

export default function Avatar(props: AvatarProps) {
  return (
    <Image
      src={props.url ?? '/assets/images/avatar.png'}
      alt="Avatar"
      className={styles.avatar}
      width={props.width ?? 25}
      height={props.height ?? 25}
    />
  );
}
