import Link from 'next/link';
import Image from 'next/image';
import NavBar from './NavBar';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/eco-dex dark.png"
          alt="Eco-Dex Logo - Return to Home"
          width={75}
          height={75}
        />
      </Link>
      <NavBar />
    </header>
  );
}