'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Import the auth hook
import styles from './page.module.css';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Animal Identifier</h1>
        <p className={styles.description}>
          Our mission is to help people learn about the amazing animals around them and promote conservation efforts.
        </p>
        
        <div className={styles.ctaContainer}>
          {currentUser ? (
            // If user is logged in, show a link to their private dashboard
            <Link href="/dashboard" className={styles.button}>
              Go to Your Dashboard
            </Link>
          ) : (
            // If user is logged out, show login and signup links
            <>
              <Link href="/login" className={styles.button}>Log In</Link>
              <Link href="/signup" className={styles.buttonSecondary}>Sign Up</Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}