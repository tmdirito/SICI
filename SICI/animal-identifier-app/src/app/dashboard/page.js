'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import UploadForm from '../components/UploadForm';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Loading state to prevent errors while checking auth
  if (!currentUser) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading user data...</p>;
  }

  // Render the page with the old dashboard header completely removed
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UploadForm />
      </main>
    </div>
  );
}