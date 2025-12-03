'use client';

import React, { useState } from 'react';
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
      router.push('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const closeMenu = () => setIsOpen(false);
  const linkStyle = styles.linkStyle; // Use the CSS module class name

  // Helper function to render auth buttons for reuse
  const renderAuthButtons = (mobile = false) => (
    <>
      {currentUser ? (
        <>
          <span className={mobile ? styles.authStatus : "text-sm mr-4"}>
            Hi, {currentUser.email}
          </span>
          <button onClick={handleLogout} className={linkStyle}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className={linkStyle} onClick={closeMenu}>
            Login
          </Link>
          <Link href="/signup" className={linkStyle} onClick={closeMenu}>
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  const renderNavLinks = () => (
    <>
      {currentUser && (
        <Link href="/dashboard" className={linkStyle} onClick={closeMenu}>
          Identify Animals
        </Link>
      )}
      <Link href="/history" className={linkStyle} onClick={closeMenu}>
        History
      </Link>
      <Link href="/tutorial" className={linkStyle} onClick={closeMenu}>
        Tutorial
      </Link>
      <Link href="/about" className={linkStyle} onClick={closeMenu}>
        Info
      </Link>
    </>
  );

  return (
    <nav className={styles.nav}>
      {/* --- 1. Desktop View (Visible until 1024px) --- */}
      <div className={styles.desktopLinks}>
        <div className={styles.navLinks}>
          {renderNavLinks()}
        </div>
        <div className={styles.authLinks}>
          {renderAuthButtons()}
        </div>
      </div>
      
      {/* --- 2. Hamburger Button (Hidden on desktop, appears for mobile/overflow) --- */}
      <button 
        className={styles.hamburger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
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

      {/* --- 3. Mobile/Collapsible Menu (Hidden by default, slides in from right) --- */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : ''}`}>
        
        {/* Top Section: Navigation Links */}
        <div className={styles.mobileLinks}>
          {renderNavLinks()}
        </div>

        {/* Bottom Section: Authentication Links (Pushed to bottom by flexbox) */}
        <div className={styles.mobileAuth}>
          {renderAuthButtons(true)}
        </div>
      </div>
    </nav>
  );
}
