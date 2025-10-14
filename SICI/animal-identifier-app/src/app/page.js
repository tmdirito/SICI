"use client";
import styles from './page.module.css';
import UploadForm from './components/UploadForm';
import NavBar from './components/NavBar';
import { useState } from 'react';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext'; // Import the auth hook

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className={styles.page}>
          <NavBar />
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