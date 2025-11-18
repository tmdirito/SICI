'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

export default function NavBar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // Redirect to homepage on logout
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const closeMenu = () => setIsOpen(false);
  const linkStyle = "inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-all duration-200";

  return (
    <nav className={styles.nav}>
      {/* Hamburger Button */}
      <button 
        className={styles.hamburger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {/* Simple SVG Icon for Hamburger/Close */}
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>
      <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}>
      <div className={styles.navLinks}>
        {currentUser && (
          <Link href="/dashboard" className={styles.linkStyle} onClick={closeMenu}>
            Identify Animals
          </Link>
        )}
        <Link href="/history" className={styles.linkStyle} onClick={closeMenu}>
          History
        </Link>
        <Link href="/tutorial" className={styles.linkStyle} onClick={closeMenu}>
          Tutorial
        </Link>
        <Link href="/about" className={styles.linkStyle} onClick={closeMenu}>
          About
        </Link>
        {/* You can add back Tutorial and Info links here if you wish */}
      </div>
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
            <Link href="/login" className={styles.linkStyle} onClick={closeMenu}>
              Login
            </Link>
            <Link href="/signup" className={styles.linkStyle} onClick={closeMenu}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}