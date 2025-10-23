'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to homepage on logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const linkStyle = "inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200";

  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        {currentUser && (
          <Link href="/dashboard" className={styles.linkStyle}>
            Identify Animals
          </Link>
        )}
        <Link href="/history" className={styles.linkStyle}>
          History
        </Link>
        <Link href="/tutorial" className={styles.linkStyle}>
          Tutorial
        </Link>
        <Link href="/about" className={styles.linkStyle}>
          About
        </Link>
        {/* You can add back Tutorial and Info links here if you wish */}
      </div>

      <div className={styles.authLinks}>
        {currentUser ? (
          <>
            <span className="text-sm mr-4">Hi, {currentUser.email}</span>
            <button onClick={handleLogout} className={styles.linkStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.linkStyle}>
              Login
            </Link>
            <Link href="/signup" className={styles.linkStyle}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}