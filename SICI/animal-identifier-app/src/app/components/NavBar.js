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
      setIsOpen(false); // Close menu if open
      router.push('/'); // Redirect to homepage
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const closeMenu = () => setIsOpen(false);
  
  // Use the CSS module class for consistent glassmorphism style
  const linkStyle = styles.linkStyle; 

  // --- Helper: Render Auth Buttons (Login/Signup/Logout) ---
  // The 'mobile' prop allows us to style the email text differently in the mobile menu
  const renderAuthButtons = (mobile = false) => (
    <>
      {currentUser ? (
        <>
          <span className={mobile ? styles.authStatus : styles.desktopAuthStatus}>
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

  // --- Helper: Render Navigation Links ---
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
      
      {/* --- 1. Desktop View --- */}
      {/* Hidden via CSS on screens smaller than 1024px */}
      <div className={styles.desktopLinks}>
        <div className={styles.navLinks}>
          {renderNavLinks()}
        </div>
        <div className={styles.authLinks}>
          {renderAuthButtons(false)}
        </div>
      </div>
      
      {/* --- 2. Hamburger Button --- */}
      {/* Hidden via CSS on screens larger than 1024px */}
      <button 
        className={styles.hamburger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          // Close Icon (X)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // Menu Icon (Hamburger)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* --- 3. Mobile Slide-out Menu --- */}
      {/* Always rendered, but styled to slide in/out based on 'isOpen' state */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : ''}`}>
        
        {/* Top: Nav Links */}
        <div className={styles.mobileLinks}>
          {renderNavLinks()}
        </div>

        {/* Bottom: Auth Links */}
        <div className={styles.mobileAuth}>
          {renderAuthButtons(true)}
        </div>
      </div>

    </nav>
  );
}