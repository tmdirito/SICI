'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import UploadForm from '../components/UploadForm';
import styles from '../page.module.css';
import Header from '../components/Header';
export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  // This effect handles redirecting unauthenticated users.
  useEffect(() => {
    // We only want to redirect if the auth check is complete AND there's no user.
    // The useAuth hook provides a `loading` state we can add.
    // For now, let's assume if currentUser is null after the initial check, we redirect.
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // If currentUser is null, it means we are either logged out or still loading.
  // We show a loading message to prevent the UploadForm from trying to run its query
  // with a null user ID. This is the key fix.
  if (!currentUser) {
    return <p>Loading user data...</p>;
  }

  // Only when we are sure currentUser exists, we render the page.
  return (
    <>
    <Header/>
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
    </>
  );
}