'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import UploadForm from '../components/UploadForm';
import styles from '../page.module.css';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This is the page protector.
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // If a user is logged in, show the main application
  if (currentUser) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.header}>
            <span>Welcome, {currentUser.email}</span>
            <button onClick={() => logout().then(() => router.push('/'))} className={styles.logoutButton}>
              Logout
            </button>
          </div>
          <UploadForm />
        </main>
      </div>
    );
  }

  // Show a loading indicator while Firebase checks the user's status
  return <p>Loading...</p>;
}